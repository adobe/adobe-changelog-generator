/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import type { LoaderInterface } from './api/loader-interface';
import type { FilterInterface } from './api/filter-interface';
const aioConfig = require('@adobe/aio-lib-core-config');
const _ = require('lodash');
const GithubService = require('./services/github');
const ConfigService = require('./services/config');
const asyncService = require('./services/async');
const templateManager = require('./template-manager');
const Config = require('./models/config');
const loaderManager = require('./loader-manager');
const filterManager = require('./filter-manager');
const groupManager = require('./group-manager');
const fileService = require('./services/file');
const RangeService = require("./services/range");
const NamespaceService = require("./services/namespace");

class Index {
    configService:Object
    githubService:Object
    rangeService:Object
    namespaceService:Object

    /**
     * @param {string} token - Github access token
     * @param {string} configPath - Path to config location
     * @param {string} configPathType - Type of the path (Absolute|Relative)
     */
    constructor (token:string, configPath?:string, configPathType?:string) {
    	this.githubService = new GithubService(token);
    	this.configService = new ConfigService(this.githubService, aioConfig);
    	this.rangeService = new RangeService(this.githubService);
    	this.namespaceService = new NamespaceService();
    	this.configPath = configPath;
    	this.configPathType = configPathType;
    }

    /**
     * Generate changelog file for multiple namespaces
     *
     * @param {Array<string>} namespaceNames - List on namespaces. Example: ['adobe/adobe-changelog-generator:master']
     * @return {Promise<void>}
     */
    async generate(namespaceNames?:Array<string>) {
    	const configLocal = await this.configService.getLocal(this.configPath, this.configPathType);
    	const namespaceNamesList = namespaceNames && namespaceNames.length ?
    		namespaceNames : this.namespaceService.getNames(configLocal);
    	for await (const namespaceName of namespaceNamesList) {
    		await this.generateNamespace(namespaceName, configLocal[namespaceName]);
    	}
    }

    /**
     * Generate changelog for one namespace
     *
     * @param {string} namespaceName - name of namespace
     * @param {Object} configLocal - configuration from local machine
     * @return {Promise<void>}
     */
    async generateNamespace(namespaceName:string, configLocal:Object) {
    	const { releaseLine, combine, ...configOptions } = _.merge(
    		await this.configService.getRemote(namespaceName),
    		configLocal
    	);

    	const sharedConfig = new Config(configOptions);
    	const loader:LoaderInterface = await this.getLoader(sharedConfig);
    	const groupBy = await this.getGroup(sharedConfig);
    	const filters = await this.getFilters(sharedConfig);
    	const template = templateManager.get(sharedConfig.getTemplate());
    	const data = await asyncService.mapValuesAsync(
    		{[namespaceName]: releaseLine, ...combine},
    		(releaseLine, namespaceName) => this.getData(
    			namespaceName,
    			releaseLine,
    			loader,
    			groupBy,
    			filters
    		)
    	);

    	fileService.create(
    		`${sharedConfig.getProjectPath()}/${sharedConfig.getFilename()}`,
    		template(data)
    	);
    }

    /**
     * Collect data for namespace
     *
     * @param {string} namespaceName - namespace name
     * @param {string} releaseLine - release line field from configuration. Pattern: <type>..<type>@<version>:<regexp>
     * @param {Object} loader - Data loader
     * @param {Object|null} groupBy - Groups data
     * @param {Array<Object>|null} filters - Filters data
     * @return {Promise<Object>}
     */
    async getData(
    	namespaceName:string,
    	releaseLine:string,
    	loader:LoaderInterface,
    	groupBy?:Object,
    	filters?:Array<FilterInterface>
    ):Array<Object> {
    	const parsedNamespace = this.configService.parseNamespace(namespaceName);
    	const parsedReleaseLine = this.configService.parseReleaseLine(releaseLine);
    	const timeRange = await this.rangeService.getRange(
    		parsedNamespace.organization,
    		parsedNamespace.repository,
    		parsedReleaseLine.from,
    		parsedReleaseLine.to,
    	);

    	const versionsRange = await this.rangeService.getVersions(
    		parsedNamespace.organization,
    		parsedNamespace.repository,
    		timeRange.from,
    		timeRange.to,
    		parsedReleaseLine.filter,
    		parsedReleaseLine.version
    	);

    	let data = await loader.execute(
    		parsedNamespace.organization,
    		parsedNamespace.repository,
    		timeRange.from,
    		timeRange.to
    	);

    	if (filters && filters.length) { data = await this.applyFilters(data, filters); }
    	if (groupBy) { data = await this.applyGrouping(data, [groupBy]); }

    	return  this.getDataToVersionsMapping(data, versionsRange);
    }

    /**
     * Maps the data to corresponded version
     *
     * @param {Array<Object>} data
     * @param {Object} versionsRange - list of versions that were released between range
     * @return {Object} Mapped data to version object
     */
    getDataToVersionsMapping(data:Array<Object>, versionsRange:Object):Object {
    	data.forEach((item:Object) => {
    		const version = _.findKey(versionsRange, (versionRange:Object, versionName:string) => {
    			const createdAtTimestamp = (new Date(item.createdAt)).getTime();
    			const fromTimestamp = (new Date(versionRange.from)).getTime();
    			const toTimestamp = (new Date(versionRange.to)).getTime();
    			return createdAtTimestamp > fromTimestamp && createdAtTimestamp < toTimestamp;
    		});
    		if (!versionsRange[version].data) { versionsRange[version].data = []; }
    		versionsRange[version].data.push(item);
    	});

    	return versionsRange;
    }

    /**
     * Loaded and instantiate corresponded Group class based on configuration
     *
     * @param {Object} sharedConfig - config that contains same values for main and related namespaces
     * @return {Promise<Object|null>}
     */
    async getGroup (sharedConfig:Object) {
    	const Group = groupManager.get(sharedConfig.getGroupName());
    	return sharedConfig.getGroupName() ?
    		new Group(sharedConfig.getGroupConfig()) : null;
    }

    /**
     * Loaded and instantiate corresponded Loader class based on configuration
     *
     * @param {Object} sharedConfig - config that contains same values for main and related namespaces
     * @return {Promise<Object>}
     */
    async getLoader(sharedConfig:Object) {
    	const Loader = await loaderManager.get(sharedConfig.getLoaderName());
    	return new Loader(this.githubService);
    }

    /**
     * Loaded and instantiate corresponded Filter classes based on configuration
     *
     * @param {Object} sharedConfig - config that contains same values for main and related namespaces
     * @return {Promise<Object>}
     */
    async getFilters(sharedConfig:Object) {
    	const filterNames:Array<string> = sharedConfig.getFilterNames();
    	const filterClasses:Object = filterManager.get(filterNames);
    	return filterNames.map((name:string) => new filterClasses[name](sharedConfig.getFilter(name)));
    }

    /**
     * Apply grouping on array of data
     *
     * @param {Array<Object>} data - loaded data
     * @param {Array<Object>} groupBy - array of group class instances
     * @return {Promise<Array<Object>>} - grouped data
     */
    async applyGrouping(data:Array<Object>, groupBy:Array<Object>) {
    	for (const group of groupBy) {
    		data = group.execute(data);
    	}
    	return data;
    }

    /**
     * Apply filters on array of data
     *
     * @param {Array<Object>} data - loaded data
     * @param {Array<Object>} filters - array of filter class instances
     * @return {Promise<Array<Object>>} - filtered data
     */
    async applyFilters(data:Array<Object>, filters:Array<Object>) {
    	for (const filter of filters) {
    		data = filter.execute(data);
    	}
    	return data;
    }
}

module.exports = Index;

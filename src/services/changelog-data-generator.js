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
const _ = require('lodash');
const GithubService = require('./services/github');
const asyncService = require('./services/async');
const loaderManager = require('./loader-manager');
const filterManager = require('./filter-manager');
const groupRegistry = require('./groups/registry');
const RangeService = require("./services/range");
const GithubNamespaceParser = require("./services/github-namespace-parser");
const ChangelogGenerationTermsParser = require("./services/changelog-generation-terms-parser");

class ChangelogDataGenerator {
    githubService:Object
    rangeService:Object
    githubNamespaceParser:Object
    changelogGenerationTermsParser:Object

    /**
     * @param {string} token - Github access token
     * @param {string} configPath - Path to config location
     * @param {string} configPathType - Type of the path (Absolute|Relative)
     */
    constructor (token:string, configPath?:string, configPathType?:string) {
    	this.githubService = new GithubService(token);
    	this.rangeService = new RangeService(this.githubService);
    	this.configPath = configPath;
    	this.configPathType = configPathType;
    	this.githubNamespaceParser = new GithubNamespaceParser();
    	this.changelogGenerationTermsParser = new ChangelogGenerationTermsParser();
    }

    /**
     * Generate changelog for one namespace
     *
     * @param {string} namespaceName - name of namespace
     * @param {Object} config
     * @return {Object}
     */
    async getChangelogData(namespaceName:string, config:Object) {
    	const loader:LoaderInterface = await this.getLoader(config);
    	const groupBy = await this.getGroup(config);
    	const filters = await this.getFilters(config);
    	const data = await asyncService.mapValuesAsync(
    		{[namespaceName]: releaseLine, ...combine},
    		(releaseLine, namespaceName) => this.collectData(
    			namespaceName,
    			releaseLine,
    			loader,
    			groupBy,
    			filters
    		)
    	);
    	return data;
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
    async collectData(
    	namespaceName:string,
    	releaseLine:string,
    	loader:LoaderInterface,
    	groupBy?:Object,
    	filters?:Array<FilterInterface>
    ):Array<Object> {
    	const namespace = this.githubNamespaceParser.parse(namespaceName);
    	const changelogGenerationTerms = this.changelogGenerationTermsParser.parse(releaseLine);
    	const timeRange = await this.rangeService.getRange(
            namespace.organization,
            namespace.repository,
            changelogGenerationTerms.from,
            changelogGenerationTerms.to,
    	);

    	const versionsRange = await this.rangeService.getVersions(
            namespace.organization,
            namespace.repository,
    		timeRange.from,
    		timeRange.to,
            changelogGenerationTerms.filter,
            changelogGenerationTerms.version
    	);

    	let data = await loader.execute(
            namespace.organization,
            namespace.repository,
    		timeRange.from,
    		timeRange.to
    	);

    	if (filters && filters.length) { data = await this.applyFilters(data, filters); }
    	if (groupBy) { data = await this.applyGrouping(data, [groupBy]); }

    	return  this.mapDataToVersionsMapping(data, versionsRange);
    }

    /**
     * Maps the data to corresponded version
     *
     * @param {Array<Object>} data
     * @param {Object} versionsRange - list of versions that were released between range
     * @return {Object} Mapped data to version object
     */
    mapDataToVersionsMapping(data:Array<Object>, versionsRange:Object):Object {
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
    	const Group = groupRegistry.get(sharedConfig.getGroupName());
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

module.exports = ChangelogDataGenerator;

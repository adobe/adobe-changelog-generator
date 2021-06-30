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

import type {LoaderInterface} from '../api/loader-interface';
import type {FilterInterface} from '../api/filter-interface';
const _ = require('lodash');
const GithubService = require('./github');
const asyncService = require('./async');
const GroupFactory = require('./group-factory');
const LoaderFactory = require('./loader-factory');
const ProcessorFactory = require('./processor-factory');
const FilterFactory = require('./filter-factory');
const RangeService = require("./range");
const GithubNamespaceParser = require("./github-namespace-parser");
const ChangelogGenerationTermsParser = require("./changelog-generation-terms-parser");

class ChangelogDataGenerator {
    githubService:Object
    rangeService:Object
    githubNamespaceParser:Object
    changelogGenerationTermsParser:Object

    /**
     * @param {string} githubService - Github access token
     */
    constructor (githubService:GithubService) {
        this.githubService = githubService;
        this.rangeService = new RangeService(this.githubService);
        this.githubNamespaceParser = new GithubNamespaceParser();
        this.groupFactory = new GroupFactory();
        this.loaderFactory = new LoaderFactory();
        this.processorFactory = new ProcessorFactory();
        this.filterFactory = new FilterFactory();
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
        const loader:LoaderInterface = await this.loaderFactory.get(config.getLoaderName(), this.githubService);
        const groupBy = config.getGroupName() ?
            await this.groupFactory.get(config.getGroupName(), config.getGroupConfig()) :
            null;
        const filters = await this.getFilters(config);
        const processors = await this.getProcessors(config);
        return await asyncService.mapValuesAsync(
            {[namespaceName]: config.getReleaseLine(), ...config.getCombine()},
            (releaseLine, namespaceName) => this.collectData(
                namespaceName,
                releaseLine,
                loader,
                groupBy,
                filters,
                processors
            )
        );
    }

    /**
     * Collect data for namespace
     *
     * @param {string} namespaceName - namespace name
     * @param {string} termsLine - release line field from configuration. Pattern: <type>..<type>@<version>:<regexp>
     * @param {Object} loader - Data loader
     * @param {Object|null} groupBy - Groups data
     * @param {Array<Object>|null} filters - Filters data
     * @param {Array<Object>|null} processors
     * @return {Promise<Object>}
     */
    async collectData(
        namespaceName:string,
        termsLine:string,
        loader:LoaderInterface,
        groupBy?:Object,
        filters?:Array<FilterInterface>,
        processors?:Array<Object>
    ):Array<Object> {
        const namespace = this.githubNamespaceParser.parse(namespaceName);
        const changelogGenerationTerms = this.changelogGenerationTermsParser.parse(termsLine);
        const timeRange = await this.rangeService.getRange(
            namespace.organization,
            namespace.repository,
            changelogGenerationTerms.from,
            changelogGenerationTerms.to,
            changelogGenerationTerms.filter
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
            namespace.branch,
            timeRange.from,
            timeRange.to
        );

        if (processors && processors.length) {
            data = await this.applyProcessors(data, processors);
        }

        if (filters && filters.length) {
            data = await this.applyFilters(data, filters);
        }
        if (groupBy) {
            data = await this.applyGrouping(data, [groupBy]);
        }

        return this.mapDataToVersionsMapping(data, versionsRange);
    }

    /**
     * @param data
     * @param processors
     * @return {Promise<Array<Object>>}
     */
    async applyProcessors(data:Array<Object>, processors:Array<Object>) {
        for (const processor of processors) {
            data = await processor.execute(data);
        }
        return data;
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
                const mergedAtTimestamp = (new Date(item.mergedAt)).getTime() || (new Date(item.closedAt)).getTime();
                const fromTimestamp = (new Date(versionRange.from)).getTime();
                const toTimestamp = (new Date(versionRange.to)).getTime();
                return mergedAtTimestamp >= fromTimestamp && mergedAtTimestamp <= toTimestamp;
            });

            if (!versionsRange[version].data) {
                versionsRange[version].data = [];
            }
            versionsRange[version].data.push(item);
        });

        return versionsRange;
    }

    /**
     * Loaded and instantiate corresponded Filter classes based on configuration
     *
     * @param {Object} sharedConfig - config that contains same values for main and related namespaces
     * @return {Promise<Object>}
     */
    async getFilters(sharedConfig:Object) {
    	return await asyncService.mapAsync(sharedConfig.getFilters(), (filter:Object) =>
            this.filterFactory.get(filter.name, filter));
    }

    /**
     * @param sharedConfig
     * @return {Promise<Array>}
     */
    async getProcessors(sharedConfig:Object):Array<Object> {
        return await asyncService.mapAsync(sharedConfig.getProcessors(), (processor:Object) =>
            this.processorFactory.get(processor.name, processor));
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

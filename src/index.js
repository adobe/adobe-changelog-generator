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

import type { LoaderInterface } from './api/loader-interface.js';
import type { FilterInterface } from './api/filter-interface.js';
import type { PullRequestData } from './api/data/pullrequest.js';
const aioConfig = require('@adobe/aio-lib-core-config');
const _ = require('lodash');
const GithubService = require('./services/github');
const ConfigService = require('./services/config');
const TagService = require('./services/tag');
const asyncService = require('./services/async');
const templateManager = require('./template-manager');
const NamespaceConfig = require('./models/namespace-config');
const loaderManager = require('./loader-manager');
const filterManager = require('./filter-manager');
const groupManager = require('./group-manager');
const fileService = require('./services/file');


class Index {
    configService:Object
    tagService:Object
    githubService:Object

    constructor (token:string) {
        this.githubService = new GithubService(token);
        this.configService = new ConfigService(this.githubService, aioConfig);
        this.tagService = new TagService(this.githubService);
    }

    async getConfig (repositories:Array<string>, configPath:string, pathType:string) {
        const localConfig = await this.configService.getLocalConfigs(repositories, configPath, pathType);
        const inRepoConfig = await this.configService.getInRepoConfigs(Object.keys(localConfig));
        return _.merge(inRepoConfig, localConfig);
    }

    async validateConfig (config:Object) {
        const commonConfigErrors = await this.configService.validate(config);
        return commonConfigErrors.length ? commonConfigErrors : null;
    }

    async getNamespaceMeta (namespaceConfig:NamespaceConfig) {
        const namespaceTags = {
            [namespaceConfig.getName()]: { tag: namespaceConfig.getTag() },
            ...namespaceConfig.getCombined()
        };

        return await asyncService.mapValuesAsync(
            namespaceTags,
            async (data, np) => {
                const parsedNamespace = this.configService.parseNamespace(np);
                return {
                    ...parsedNamespace,
                    versions: await this.tagService.getTagDates(
                        data.tag,
                        parsedNamespace.organization,
                        parsedNamespace.repository
                    )
                };
            }
        );
    }

    async getDataForNamespace (namespaceConfig:NamespaceConfig) {
        const namespaceMeta = await this.getNamespaceMeta(namespaceConfig);
        const Loader = loaderManager.get(namespaceConfig.getLoaderName());
        const filtersConfig = namespaceConfig.getFilters();
        const GroupByClass = namespaceConfig.getGroupName() ? groupManager.get(namespaceConfig.getGroupName()) : null;
        const groupBy = GroupByClass ? new GroupByClass(namespaceConfig.getGroupConfig()) : null;
        const dataLoader:LoaderInterface = new Loader(
            this.githubService,
            Object.keys(filtersConfig).map((ftr:string) => {
                const FtrClass = filterManager.get(ftr);
                const filter:FilterInterface = new FtrClass(filtersConfig[ftr]);
                return filter;
            }),
            groupBy
        );

        return asyncService.mapValuesAsync(namespaceMeta, async (data, np) => {
            return await asyncService.mapValuesAsync(data.versions, async (dateRange) => {
                const data:Array<PullRequestData> = await dataLoader.execute(
                    namespaceMeta[np].organization,
                    namespaceMeta[np].repository,
                    dateRange.from,
                    dateRange.to
                );
                return {
                    createdAt: dateRange.to,
                    data: data.map(item => ({
                        ...item,
                        repository: namespaceMeta[np].repository,
                        organization: namespaceMeta[np].organization,
                        author: item.author.login
                    }))
                };
            });
        });
    }

    async getGeneratedTemplate(
        namespaceConfig:NamespaceConfig,
        data:Array<Object>,
        beforeGeneration:? Function,
        afterGeneration:? Function
        ) {
        templateManager.get(namespaceConfig.getTemplate())(data);
    }

    async execute (config:Object) {
        for await (const np of Object.keys(config)) {
            console.log(`Generation Changelog for ${np}...`);
            const namespaceConfig = new NamespaceConfig(np, config[np]);
            const data = await this.getDataForNamespace(namespaceConfig);
            const generatedTemplate = await this.getGeneratedTemplate(namespaceConfig, data);

            fileService.create(
                `${namespaceConfig.getProjectPath()}/${namespaceConfig.getFilename()}`,
                data
            );
            console.log(`Changelog for ${np} is generated and available by the path: ${namespace.getProjectPath()}/${namespace.getFilename()}`);
        }
    }
}

module.exports = Index;

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

const _ = require('lodash');
const ConfigLoader = require('./services/config-loader');
const ChangelogDataGenerator = require("./services/changelog-data-generator");
const ChangelogWriterRegistry = require('./services/changelog-writer-registry');
const GithubService = require('./services/github');
const Config = require('./models/config');

class Index {
    githubService:Object
    configLoader:Object
    configPath:string
    configPathType:string
    changelogDataGenerator:Object

    /**
     * @param {string} githubToken - Github access token
     * @param {string} githubUrl - Github Url
     * @param {string} configPath - Path to config location
     * @param {string} configPathType - Type of the path (Absolute|Relative)
     */
    constructor(githubToken:string, githubUrl:string, configPath?:string, configPathType?:string) {
        this.githubService = new GithubService(githubToken, githubUrl);
        this.configLoader = new ConfigLoader(this.githubService);
        this.changelogWriterRegistry = new ChangelogWriterRegistry();
        this.configPath = configPath;
        this.configPathType = configPathType;
        this.changelogDataGenerator = new ChangelogDataGenerator(this.githubService);
        global.__basedir = __dirname;
    }

    /**
     * Generate changelog file for multiple namespaces
     *
     * @param {Array<string>} namespaceNames - List on namespaces. Example: ['adobe/adobe-changelog-generator:master']
     * @return {Promise<void>}
     */
    async generate(namespaceNames?:Array<string>) {
        const localConfig = await this.configLoader.getLocalConfig(this.configPath);
        const promises = [];
        const namespaceNamesList = namespaceNames && namespaceNames.length ?
            namespaceNames : Object.keys(localConfig);

        for (const namespaceName of namespaceNamesList) {

            const configOptions = _.merge(
                await this.configLoader.getRepositoryConfig(namespaceName),
                localConfig[namespaceName],
                {localConfigPath: this.configPath}
            );
            const config = new Config(configOptions);
            const data = await this.changelogDataGenerator.getChangelogData(namespaceName, config);
            const fileWriter = this.changelogWriterRegistry.get(config.getOutputFormat());
            promises.push(new Promise((resolve, reject) => {
                fileWriter.write(
                    data,
                    config,
                    (error, data) => error ?
                        reject(error) :
                        resolve({namespace: namespaceName, ...data })
                );
            }));

            return promises;
        }
    }
}

module.exports = Index;

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

const fileLoader = require('./file');
const aioConfig = require('@adobe/aio-lib-core-config');
const GithubService = require('./github');
const GithubNamespaceParser = require("./services/github-namespace-parser");

class ConfigLoader {
    aioConfig:Object
    githubRestClient:Object
    githubNamespaceParser:Object

    /**
     * @param {string} githubToken
     */
    constructor (githubToken:string) {
        const githubService = new GithubService(githubToken);
        this.githubRestClient = githubService.getRestClient();
        this.aioConfig = aioConfig; // TODO: extract aio
        this.githubNamespaceParser = new GithubNamespaceParser();
    }

    /**
     * Loads config from repository
     *
     * @param {string} namespaceName
     * @param {string} configPath - path to config location
     * @return {Promise<Object|null>}
     */
    async getRepositoryConfig (namespaceName:string, configPath:string = '/.github/changelog.json'):Object {
        const {organization, repository, branch} = this.githubNamespaceParser.parse(namespaceName);
        const response = await this.githubRestClient.repos.getContent({
            owner: organization,
            path: configPath,
            repo: repository,
            ref: branch || 'master'
        })
            .then((res) => res.data || {})
            .catch(() => {});
        return response
            ? JSON.parse(Buffer.from(response.content, 'base64').toString('binary'))
            : null;
    }

    /**
     * Loads local config
     *
     * @param {string} configPath - path to config location
     * @param {string} pathType - path type (absolute|relative). Default: Absolute
     * @return {Promise<JSON|Error|*>}
     */
    async getLocalConfig(configPath?:string, pathType:string):Object {
        return configPath
            ? fileLoader.load(configPath, pathType)
            : this.aioConfig.get('changelog') || {};
    }
}

module.exports = ConfigLoader;

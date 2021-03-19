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

class ConfigService {
  aioConfig:Object
  githubRestClient:Object
  constructor (githubService:Object, aioConfig:Object) {
  	this.githubRestClient = githubService.getRestClient();
  	this.aioConfig = aioConfig;
  }

  /**
     * Parses namespace pattern. Namespace example: adobe/adobe-changelog-generator:master
     *
     * @param {string} namespace
     * @return {{organization: string, repository: string, branch: string}} | Error
     */
  parseNamespace (namespace:string):Object | Error {
  	const parsed:Array<string> = namespace.match(/(.*)\/(.*):(.*)/) || [];

  	if (!parsed[1] || !parsed[2] || !parsed[3]) {
  		throw new Error(`
            The namespace pattern is broken, please configure namespace in correct pattern.
            Pattern example: <organization>/<repository>:branch
        `);
  	}

  	return {
  		organization: parsed[1],
  		repository: parsed[2],
  		branch: parsed[3]
  	};
  }

  /**
     * Parses release line. Example: <type>..<type>@<version>:<regexp>
     *
     * @param {string} releaseLine
     * @return {{filter: string, from: string, to: string, version: string}}
     */
  parseReleaseLine (releaseLine:string):Object | Error {
  	let match, filter, version, from, to;
  	[match, filter] = releaseLine.split(':');
  	[match, version] = match.split('@');
  	[from, to] = match.split('..');

  	return {from, to, version, filter};
  }

  /**
     * Loads config from repository
     *
     * @param {string} namespace
     * @param {string} configPath - path to config location
     * @return {Promise<Object|null>}
     */
  async getRemote (namespace:string, configPath:string = '/.github/changelog.json'):Object {
  	const { organization, repository, branch } = this.parseNamespace(namespace);
  	const response = await this.githubRestClient.repos.getContent({
  		owner: organization,
  		path: configPath,
  		repo: repository,
  		ref: branch || 'master'
  	}).then((res) => res.data || {}).catch(() => {});
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
  async getLocal (configPath?:string, pathType:string):Object {
  	return  configPath
  		? fileLoader.load(configPath, pathType)
  		: this.aioConfig.get('changelog') || {};
  }
}

module.exports = ConfigService;

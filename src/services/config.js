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

const fileLoader = require('../file-loader');
const _ = require('lodash');

class ConfigService {
  client:Object
  aioConfig:Object
  githubRestClient:Object
  constructor (githubService:Object, aioConfig:Object) {
    this.githubRestClient = githubService.getRestClient();
    this.aioConfig = aioConfig;
  }

  parseNamespace (namespace:string):Object {
    const parsed:Array<string> = namespace.match(/(.*)\/(.*):(.*)/) || [];
    return {
      organization: parsed[1],
      repository: parsed[2],
      branch: parsed[3]
    };
  }

  async getInRepoConfigs (namespaces:Array<string>, configPath:string = '/.github/changelog.json'):Object {
    const result = {};
    for (const namespace of namespaces) {
      const { organization, repository, branch } = this.parseNamespace(namespace);
      const response = await this.githubRestClient.repos.getContent({
        owner: organization,
        path: configPath,
        repo: repository,
        ref: branch || 'master'
      }).then((res) => res.data || {}).catch(() => {});
      result[namespace] = response
        ? JSON.parse(Buffer.from(response.content, 'base64').toString('binary'))
        : {};
    }
    return result;
  }

  async getLocalConfigs (namespaces:Array<string>, configPath?:string, pathType:string):Object {
    const localConfig = configPath
      ? fileLoader.load(configPath, pathType)
      : this.aioConfig.get('changelog') || {};

    return !namespaces.length ? localConfig : filterItems(localConfig, namespaces);
  }

  async validate (config:Object):Promise<Array<string>> {
    const requiredFields = ['tag', 'loader.name', 'output.template'];
    const errors = [];
    Object.keys(config).forEach(namespace => {
      const invalidFields = requiredFields.filter(field => !_.get(config[namespace], field));
      if (!invalidFields.length) {
        return;
      }
      errors.push(
        invalidFields.length === 1
          ? `${namespace} is invalid. Field ${invalidFields[0]} is required`
          : `${namespace} is invalid. Fields: ${invalidFields.join(', ')} are required`
      );
    });
    return errors;
  }
}

const filterItems = (localConfig:Object, namespaces:Array<string>):Object => {
  const res = {};
  namespaces.forEach(item => { res[item] = localConfig[item]; });
  return res;
};

module.exports = ConfigService;

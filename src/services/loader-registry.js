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
const DynamicFilesLoader = require('./dynamic-files-loader');
const CaseConvertor = require('./case-convertor');

class LoaderRegistry {
    dynamicFilesLoader:Object
    caseConvertor:Object

    /**
     * @constructor
     */
    constructor() {
        this.dynamicFilesLoader = new DynamicFilesLoader('loaders');
        this.caseConvertor = new CaseConvertor();
    }

    /**
     * Loads loader by name
     *
     * @param name
     * @param {{graphql}} githubService TODO: should be removed from parameters
     * @return {Promise<Object|null>}
     */
    get(name:string, githubService:Object):Function {
        const Loader = this.dynamicFilesLoader.get(this.caseConvertor.convertPascalToDash(name));
        return new Loader(githubService);
    }
}

module.exports = LoaderRegistry;

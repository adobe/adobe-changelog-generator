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

class FilterRegistry {
    dynamicFilesLoader:Object;
    caseConvertor:Object;

    /**
     * @constructor
     */
    constructor() {
        this.dynamicFilesLoader = new DynamicFilesLoader('filters');
        this.caseConvertor = new CaseConvertor();
    }

    /**
     * Loads filter by name
     *
     * @param name
     * @param config
     * @return {Promise<Object|null>}
     */
    get(name:string = 'index', config:Object):Function {
        const Filter = this.dynamicFilesLoader.get(this.caseConvertor.convertPascalToDash(name));
        return new Filter(config);
    }
}

module.exports = FilterRegistry;

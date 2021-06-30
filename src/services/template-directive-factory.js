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
import type { TemplateDirectiveInterface } from '../api/template-directive-interface';

const DynamicFilesLoader = require('./dynamic-files-loader');
const CaseConvertor = require('./case-convertor');
const _ = require('lodash');

class TemplateDirectiveFactory {
    caseConvertor:Object;
    dynamicFilesLoader:Object;

    /**
     * @constructor
     */
    constructor() {
        this.caseConvertor = new CaseConvertor();
        this.dynamicFilesLoader = new DynamicFilesLoader('template-directives');
    }

    /**
     * Get template directive by name
     *
     * @param name
     * @return {Promise<TemplateDirectiveInterface>}
     */
    async get(name:string):Promise<TemplateDirectiveInterface> {
        return this.dynamicFilesLoader.get(name);
    }

    /**
     * Get all available directives
     * @return {Promise<{}>}
     */
    async getAll():Object {
        const files = await this.dynamicFilesLoader.getAll();
        const directivesMap = {};
        _.values(files).forEach((Directive:TemplateDirectiveInterface) => {
            //$FlowFixMe
            directivesMap[this.caseConvertor.convertPascalToUnderscore(Directive.name)] = (new Directive()).execute;
        });

        return directivesMap;
    }
}

module.exports = TemplateDirectiveFactory;

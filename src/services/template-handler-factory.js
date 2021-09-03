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
import type { TemplateHandlerInterface } from '../api/template-handler-interface';

const DynamicFilesLoader = require('./dynamic-files-loader');
const CaseConvertor = require('./case-convertor');

class TemplateHandlerFactory {
    caseConvertor:Object;
    dynamicFilesLoader:Object;

    /**
     * @constructor
     */
    constructor() {
        this.caseConvertor = new CaseConvertor();
        this.dynamicFilesLoader = new DynamicFilesLoader('template-handlers');
    }

    /**
     * @param name
     * @param config
     * @return {*}
     */
    get(name:string, config:Object):TemplateHandlerInterface {
        const Handler = this.dynamicFilesLoader.get(
            this.caseConvertor.convertPascalToDash(
                name.slice(name.length-1) === 's' ?
                    name.slice(0, name.length-1) :
                    name
            )
        );
        return new Handler(config);
    }
}

module.exports = TemplateHandlerFactory;

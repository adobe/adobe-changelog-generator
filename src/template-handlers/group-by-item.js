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

const TemplateStringProcessor = require('../services/template-string-processor');
const _ = require('lodash');

class ContributionTypeHandler implements TemplateHandlerInterface {
    templateStringProcessor:Object;

    /**
     * @constructor
     */
    constructor(config) {
        this.templateStringProcessor = new TemplateStringProcessor();
        this.config = config;
    }

    /**
     *
     * @param {string} template
     * @param {Object} data
     * @param {Object} variables
     * @param {Object} directives
     * @return {Array<Object>}
     */
    execute(template:string, data:Object, variables = {}, directives = {}):Array<Object> {
        const results = [];
        const dataWithoutGroupByValue = data.filter((item:Object) => {
            const val = _.get(item, this.config.getGroupBy());
            if (Array.isArray(val)) {
                return !val[0];
            }
            return !val;
        });
        const dataWithGroupByValue = data.filter((item:Object) => {
            const val = _.get(item, this.config.getGroupBy());
            if (Array.isArray(val)) {
                return val[0];
            }
            return val;
        });
        const groupByValues = _.uniq(dataWithGroupByValue.map((item:Object) => {
            let val = _.get(item, this.config.getGroupBy());
            if (Array.isArray(val)) {
                val = val[0];
            }
            return val;
        }));
        if (dataWithoutGroupByValue.length) {
            results.push({
                evaluatedTemplate: '',
                variables,
                data: dataWithoutGroupByValue,
                directives
            });
        }

        groupByValues.forEach((groupByValue:Object) => {
            variables['group_by'] = groupByValue;
            results.push({
                evaluatedTemplate: this.templateStringProcessor.evaluateStringTemplate(
                    template,
                    variables,
                    directives
                ),
                data: dataWithGroupByValue.filter((item:Object) => {
                    let val = _.get(item, this.config.getGroupBy());
                    if (Array.isArray(val)) {
                        return val[0] === groupByValue;
                    }

                    return val === groupByValue;
                }),
                variables,
                directives
            });
        });
        return results;
    }
}

module.exports = ContributionTypeHandler;

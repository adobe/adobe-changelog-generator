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

class CrossReferenceHandler implements TemplateHandlerInterface {
    templateStringProcessor:Object;

    /**
     * @constructor
     */
    constructor() {
        this.templateStringProcessor = new TemplateStringProcessor();
    }

    /**
     *
     * @param {string} template
     * @param {Object} data
     * @param {Object} variables
     * @param {Object} directives
     * @return {Array<Object>}
     */
    execute(template:string, data:Object, variables = {}, directives = {}) {
        const results = [];
        data = data || [];
        data.crossReference.forEach((item:Object) => {
            variables.reference_number = item.number;
            variables.reference_organization = item.organization;
            variables.reference_repository = item.repository;
            variables.reference_state = item.state;
            variables.reference_type = item.type;
            results.push({
                evaluatedTemplate: this.templateStringProcessor.evaluateStringTemplate(
                    template,
                    variables,
                    directives
                ),
                data: data || [],
                variables,
                directives
            });
        });
        return results;
    }
}

module.exports = CrossReferenceHandler;

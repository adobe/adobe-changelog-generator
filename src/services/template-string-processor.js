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
const stringTemplateParser = require('string-template-parser');

class TemplateStringProcessor {
    stringTemplateParser:Object;

    /**
     * @constructor
     */
    constructor() {
        this.stringTemplateParser = stringTemplateParser.parseStringTemplateGenerator({
            VARIABLE_START: /^\{\{\s*/,
            VARIABLE_END: /^\s*\}\}/
        });
    }

    /**
     * Evaluate template with the passed variables
     *
     * @param {string} template
     * @param {Object} variables
     * @param {Object} directives
     * @return {string}
     */
    evaluateStringTemplate(template:string, variables:Object, directives?:Object):string {
        return this.evaluateParsedTemplate(
            this.parseStringTemplate(template),
            variables,
            directives
        );
    }

    /**
     * Evaluate parsed template
     *
     * @param {Object} parsedTemplate
     * @param {Object} variables
     * @param {Object} directives
     * @return {string}
     */
    evaluateParsedTemplate(parsedTemplate:Object, variables:Object, directives?:Object):string {
        return stringTemplateParser.evaluateParsedString(parsedTemplate, variables, directives);
    }

    /**
     * @param {string} template
     * @return {Object}
     */
    parseStringTemplate(template:string):Object {
        return this.stringTemplateParser(template);
    }
}

module.exports = TemplateStringProcessor;

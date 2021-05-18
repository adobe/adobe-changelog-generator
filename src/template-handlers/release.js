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
const formatFns = require('date-fns').format;

class ReleaseHandler implements TemplateHandlerInterface {
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
        const releases = new Map(Object.entries(data)
            .sort((itemFirst:Object, itemSecond:Object) => itemSecond[1].to - itemFirst[1].to));

        for (const [release, releaseContent] of releases) {
            variables.tag = release;
            variables['created_at'] = formatFns(releaseContent.to, 'yyyy-MM-dd');
            results.push({
                evaluatedTemplate: this.templateStringProcessor.evaluateStringTemplate(
                    template,
                    variables,
                    directives
                ),
                data: releaseContent.data || [],
                variables,
                directives
            });
        }
        return results;
    }
}
module.exports = ReleaseHandler;

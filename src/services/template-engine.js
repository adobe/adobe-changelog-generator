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
import type { TemplateHandlerInterface } from '../api/template-handler-interface';

const TemplateDirectiveRegistry = require('./template-directive-registry');
const TemplateHandlerRegistry = require('./template-handler-registry');

class TemplateEngine {
    templateDirectiveRegistry:Object;
    templateHandlerRegistry:Object;

    /**
     * @constructor
     */
    constructor() {
        this.templateDirectiveRegistry = new TemplateDirectiveRegistry();
        this.templateHandlerRegistry = new TemplateHandlerRegistry();
    }

    /**
     * Evaluates template with passed data
     *
     * @param {string} template - string in specific format
     * @param {Object} data
     * @return {Promise<string>}
     */
    async generateByTemplate(template:string, data:Object):Promise<string> {
        const parsedTemplateTree = this.getTemplateForRepeats(template);
        const directives:Array<TemplateDirectiveInterface> = await this.templateDirectiveRegistry.getAll();
        const evaluatedTemplateTree = await this.getEvaluatedTemplateByTree(parsedTemplateTree, data, {}, [], directives);
        return this.getEvaluatedStringByEvaluatedTree(evaluatedTemplateTree);
    }

    /**
     * Concatenates evaluated strings to result string
     *
     * @param {Array<Object>} templateTree
     * @return {string}
     */
    getEvaluatedStringByEvaluatedTree(templateTree:Array<Object>):Array<Object> {
        let templateString = '';

        templateTree.forEach((item:Object) => {
            templateString += item.evaluatedTemplate;
            if (item.inside) {
                templateString += this.getEvaluatedStringByEvaluatedTree(item.inside);
            }

            if (item.insertAfter) {
                templateString += item.insertAfter;
            }
        });

        return templateString;
    }

    /**
     * Evaluates template tree
     *
     * @param {Array<Object>}templateTree
     * @param {Object} data
     * @param {Object} variables
     * @param {Array} iteration - system parameter
     * @param {Object} directives
     * @return {Promise<Array<Object>>}
     */
    async getEvaluatedTemplateByTree(templateTree:Array<Object>, data:Object, variables:Object, iteration = [], directives?:Object):Array<Object> {
        templateTree.forEach((item:Object) => {
            const handler:TemplateHandlerInterface = this.templateHandlerRegistry.get(item.type);
            const handlerResults = handler.execute(item.template, data, variables, directives);
            handlerResults.forEach((handlerResult:Array<Object>) => {
                const nestedObject = {evaluatedTemplate: handlerResult.evaluatedTemplate};
                if (item.repeatDirective === 'scope_content') {
                    nestedObject.insertAfter =
                        `<!--${item.type}_${handlerResult.variables.organization}_${handlerResult.variables.repository}_scope_end-->`;
                    nestedObject.evaluatedTemplate +=
                        `<!--${item.type}_${handlerResult.variables.organization}_${handlerResult.variables.repository}_scope_start-->`;
                }

                iteration.push(nestedObject);
                if (item.inside) {
                    nestedObject.inside = [];
                    this.getEvaluatedTemplateByTree(
                        item.inside,
                        handlerResult.data,
                        handlerResult.variables,
                        nestedObject.inside,
                        directives
                    );
                }
            });
        });

        return iteration;
    }

    /**
     * Find and returns all repeats declaration on the same level
     *
     * @param {string} templateString
     * @param {Array} repeats
     * @return {Array<string>}
     */
    getSameLevelRepeats(templateString, repeats = []) {
        const dataRepeat = this.findRepeat(templateString);
        if (dataRepeat) {
            repeats.push(dataRepeat);
            this.getSameLevelRepeats(
                templateString.substring(
                    dataRepeat.endRepeatIndexTo,
                    templateString.length
                ),
                repeats
            );
        }

        return repeats;
    }

    /**
     * Parse string template to tree data structure
     *
     * @param {string} templateString
     * @param {Array<string>} repeats
     * @return {Array<Object>}
     */
    getTemplateForRepeats(templateString:string, repeats = []) {
        const sameLevelRepeats = this.getSameLevelRepeats(templateString);
        sameLevelRepeats.forEach((dataRepeat:Object) => {
            const internalDataRepeat = this.findRepeat(dataRepeat.template);
            const data = {
                type: dataRepeat.name,
                template: dataRepeat.template
            };

            if (dataRepeat.repeatDirective) {
                data.repeatDirective = dataRepeat.repeatDirective;
            }

            if (internalDataRepeat) {
                data.inside = [];
                data.template = dataRepeat.template.substring(0, internalDataRepeat.startRepeatIndexFrom);
                this.getTemplateForRepeats(dataRepeat.template, data.inside);
            }

            repeats.push(data);
        });

        return repeats;
    }

    /**
     * Find the closest repeat
     *
     * @param templateString
     * @return {null|{}}
     */
    findRepeat(templateString:string):Object {
        const parsed = templateString.match(/<!--repeat_([A-Za-z_0-9]+)(?:(\|([A-Za-z_0-9]+)))?-->/);

        if (!parsed) {
            return null;
        }

        const endRepeatTag = `<!--repeat_${parsed[1]}_end-->`;
        const endRepeatIndexFrom = templateString.indexOf(endRepeatTag);
        const startRepeatIndexTo = parsed.index + parsed[0].length;

        return {
            template: templateString.substring(startRepeatIndexTo, endRepeatIndexFrom),
            startRepeatIndexFrom: parsed.index,
            repeatDirective: parsed[3],
            startRepeatIndexTo,
            endRepeatIndexFrom,
            endRepeatIndexTo: endRepeatIndexFrom + endRepeatTag.length,
            name: parsed[1],
            startRepeatTag: parsed[0],
            endRepeatTag
        };
    }
}

module.exports = TemplateEngine;

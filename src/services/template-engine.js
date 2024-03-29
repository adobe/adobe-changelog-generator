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

const TemplateDirectiveFactory = require('./template-directive-factory');
const TemplateHandlerFactory = require('./template-handler-factory');
const _ = require('lodash');

class TemplateEngine {
    templateDirectiveFactory:Object;
    templateHandlerFactory:Object;

    /**
     * @constructor
     */
    constructor() {
        this.templateDirectiveFactory = new TemplateDirectiveFactory();
        this.templateHandlerFactory = new TemplateHandlerFactory();
    }

    /**
     * Evaluates template with passed data
     *
     * @param {string} template - string in specific format
     * @param {Object} data
     * @return {Promise<string>}
     */
    async generateByTemplate(template:string, data:Object, config:Object):Promise<string> {
        const parsedTemplateTree = this.getTemplateForRepeats({template, type: 'top'});
        const directives:Array<TemplateDirectiveInterface> = await this.templateDirectiveFactory.getAll();
        const evaluatedTemplateTree = await this.getEvaluatedTemplateByTree(
            parsedTemplateTree,
            data,
            {},
            [],
            directives,
            config
        );
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
            if (item.inside) {
                if (!item.inside.length) {
                    item.evaluatedTemplate = '';
                } else {
                    _.uniq(item.inside.map(elem => elem.repeatIndex)).forEach((index:number) => {
                        item.evaluatedTemplate = item.evaluatedTemplate.replace(
                            `<placeholder-repeat-${index}>`,
                            this.getEvaluatedStringByEvaluatedTree(
                                item.inside.filter((elem:Object) => elem.repeatIndex === index)
                            )
                        );
                    });
                }
            }

            templateString += item.evaluatedTemplate;
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
    async getEvaluatedTemplateByTree(templateTree:Array<Object>, data:Object, variables:Object, iteration = [], directives?:Object, config:Object):Array<Object> {
        templateTree.forEach((item:Object, index:number) => {
            const handler:TemplateHandlerInterface = this.templateHandlerFactory.get(item.type, config);
            const handlerResults = handler.execute(item.template, data, variables, directives);
            handlerResults.forEach((handlerResult:Array<Object>) => {
                const nestedObject = {
                    evaluatedTemplate: handlerResult.evaluatedTemplate,
                    type: item.type,
                    repeatIndex: index,
                    item
                };
                iteration.push(nestedObject);
                if (item.inside) {
                    nestedObject.inside = [];
                    this.getEvaluatedTemplateByTree(
                        item.inside,
                        handlerResult.data,
                        handlerResult.variables,
                        nestedObject.inside,
                        directives,
                        config
                    );
                }
            });
        });

        return iteration;
    }

    /**
     * Parse string template to tree data structure
     *
     * @param {Object} parent
     * @return {Array<Object>}
     */
    getTemplateForRepeats(parent = {}) {
        let nextRepeat = this.findRepeat(parent.template);
        let i = 0;
        while (nextRepeat) {
            const data = {
                type: nextRepeat.name,
                template: nextRepeat.template,
            };
            parent.inside = parent.inside || [];
            parent.inside.push(data);
            parent.template = parent.template.substring(0, nextRepeat.startRepeatIndexFrom) +  `<placeholder-repeat-${i}>` +  parent.template.substring(nextRepeat.endRepeatIndexTo);
            this.getTemplateForRepeats(data);
            nextRepeat = this.findRepeat(parent.template);
            i++;
        }

        return [parent];
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

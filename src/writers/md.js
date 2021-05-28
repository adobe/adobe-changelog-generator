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

import type { ChangelogWriterInterface } from '../api/changelog-writer-interface.js';

const fileService = require('../services/file');
const TemplateEngine = require('../services/template-engine');
const templateRegistry = require('../services/template-registry');
const _ = require('lodash');

class Md implements ChangelogWriterInterface {
    templateEngine:Object;

    /**
     * @constructor
     */
    constructor() {
        this.templateEngine = new TemplateEngine();
    }
    /**
     * Write changelog data to file
     *
     * @param {Array<string>} changelogData
     * @param {Object} config
     * @param callback
     * @return void
     */
    async write(changelogData:Array<string>, config:Object, callback?:Function) {
        const template = templateRegistry.get(config.getTemplate());
        const evaluatedTemplateString = await this.templateEngine.generateByTemplate(template, changelogData);
        try {
            if (config.getOutputStrategy() === 'create') {
                fileService.create(
                    `${config.getProjectPath()}/${config.getFilename()}.${config.getOutputFormat()}`,
                    evaluatedTemplateString
                );
            } else {
                this.merge(evaluatedTemplateString, config);
            }

            if (callback) {
                callback(null, {
                    filename: `${config.getFilename()}.md`,
                    path: `${config.getProjectPath()}`
                });
            }

        } catch (error) {
            if (callback) callback(error);
        }

    }

    /**
     * Merge files
     *
     * @param evaluatedTemplateString
     * @param config
     * @return {void}
     */
    async merge(evaluatedTemplateString:Array<string>, config:Object):void {
        const file = fileService.load(
            `${config.getProjectPath()}/${config.getFilename()}.${config.getOutputFormat()}`
        );
        const fileNamespaces = this.getSplitsByNamespace(file);
        const fullPath = `${config.getProjectPath()}/${config.getFilename()}.${config.getOutputFormat()}`;
        if (!file.length) {
            fileService.create(fullPath, evaluatedTemplateString);
            return;
        }
        if (!Object.keys(fileNamespaces).length) {
            fileService.create(fullPath, evaluatedTemplateString + file);
            return;
        }
        const contentNamespaces = this.getSplitsByNamespace(evaluatedTemplateString);
        let result = '';
        Object.keys(contentNamespaces).forEach((namespace:string) => {
            if (fileNamespaces[namespace]) {
                fileNamespaces[namespace].content =
                    fileNamespaces[namespace].content.slice(0, fileNamespaces[namespace].from) +
                    contentNamespaces[namespace].content.slice(
                        contentNamespaces[namespace].from,
                        contentNamespaces[namespace].to
                    ) +
                    `\n${fileNamespaces[namespace].content.slice(fileNamespaces[namespace].from)}`;
            } else {
                fileNamespaces[namespace] = contentNamespaces[namespace];
            }
        });

        Object.keys(fileNamespaces).forEach((namespace:string) => {
            result += fileNamespaces[namespace].content;
        });

        fileService.create(
            `${config.getProjectPath()}/${config.getFilename()}.md`,
            result
        );
    }

    /**
     * @param {string} file
     * @param {Object} namespaces
     * @return {Object}
     */
    getSplitsByNamespace(file:string, namespaces:Object = {}):Array {
        const from = file.match(/<!--namespaces_([A-Za-z_0-9]+)_([A-Za-z_0-9]+)_scope_start-->/);
        const to = file.match(/<!--namespaces_([A-Za-z_0-9]+)_([A-Za-z_0-9]+)_scope_end-->/);
        if (!from) {
            return namespaces;
        }
        const startPart = file.substring(0, to.index + to[0].length + 1);
        const endPart = file.substring(to.index + to[0].length + 1, file.length + 1);
        namespaces[`${from[1]}/${from[2]}`] = {
            content: startPart,
            from: from.index + from[0].length + 1,
            to: to.index,
        };

        if (endPart.length) {
            this.getSplitsByNamespace(endPart, namespaces);
        }

        return namespaces;
    }
}

module.exports = Md;

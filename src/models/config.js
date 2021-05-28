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

const _ = require('lodash');

class Config {
    data:Object;
    name:string;

    /**
     * @param {Object} data
     */
    constructor(data:Object):void {
        this.data = data;
    }

    /**
     * @return {string}
     */
    getLoaderName():string {
        return this.data.loader.name;
    }

    /**
     * @return {string}
     */
    getLocalConfigPath():string {
        return  this.data.localConfigPath;
    }

    /**
     * @return {string}
     */
    getReleaseLine():string {
        return this.data.releaseLine;
    }

    /**
     * @return {string}
     */
    getCombine():string {
        return this.data.combine;
    }

    /**
     * @return {*|{}}
     */
    getFilters():Object {
        return _.get(this.data, 'loader.config.exclude') || {};
    }

    /**
     * @return {string[]}
     */
    getFilterNames():Array<string> {
        return Object.keys(this.getFilters());
    }

    /**
     * @param name
     * @return {Object}
     */
    getFilter(name:string):Array<string> {
        return this.getFilters()[name];
    }

    /**
     * @return {string}
     */
    getGroupName():string {
        return _.get(this.data, 'loader.config.groupBy.name');
    }

    /**
     * @return {Object}
     */
    getGroupConfig():Object {
        return _.get(this.data, 'loader.config.groupBy.config');
    }

    /**
     * @return {string}
     */
    getTemplate():string {
        return _.get(this.data, 'output.template') || 'pullrequest';
    }

    /**
     * @return {*|string}
     */
    getOutputStrategy():string {
        return _.get(this.data, 'output.strategy') || 'create';
    }

    /**
     * @return {string}
     */
    getProjectPath():string {
        let path = '';

        if (!_.get(this.data, 'output.path')) {
            const splitConfigPath = this.getLocalConfigPath().split('/');
            let i = 0;

            for (i; i <= splitConfigPath.length-2; i++) {
                path += splitConfigPath[i] + '/';
            }
        }

        return _.get(this.data, 'output.path') || path;
    }

    /**
     * @return {string}
     */
    getFilename():string {
        return _.get(this.data, 'output.filename') || 'CHANGELOG';
    }

    /**
     * @return {string}
     */
    getOutputFormat():string {
        return _.get(this.data, 'output.format') || 'md';
    }

    /**
     * @return {Object}
     */
    getCombined():Object {
        return _.get(this.data, 'combine');
    }
}

module.exports = Config;

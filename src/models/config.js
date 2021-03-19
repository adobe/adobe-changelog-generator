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
    data:Object
    name:string
    constructor (data:Object):void {
    	this.data = data;
    }

    /**
     * @return {string}
     */
    getLoaderName ():string {
    	return this.data.loader.name;
    }

    /**
     * @return {*|{}}
     */
    getFilters ():Object {
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
    getGroupName ():string {
    	return _.get(this.data, 'loader.config.groupBy.name');
    }

    /**
     * @return {Object}
     */
    getGroupConfig ():Object {
    	return _.get(this.data, 'loader.config.groupBy.config');
    }

    /**
     * @return {string}
     */
    getTemplate ():string {
    	return _.get(this.data, 'output.template');
    }

    /**
     * @return {string}
     */
    getProjectPath ():string {
    	return _.get(this.data, 'output.projectPath');
    }

    /**
     * @return {string}
     */
    getFilename ():string {
    	return _.get(this.data, 'output.filename');
    }

    /**
     * @return {Object}
     */
    getCombined ():Object {
    	return _.get(this.data, 'combine');
    }
}

module.exports = Config;
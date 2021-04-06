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

import type {ReleaseParsersInterface} from '../api/release-parsers-interface.js';

const _ = require('lodash');
const specialWords = require('../models/special-words');
const addMilliseconds = require('date-fns/addMilliseconds');

class SpecialWords implements ReleaseParsersInterface {
    sortOrder:number;
    regexp:RegExp;
    githubService:Object;
    githubRestClient:Object;

    /**
     * @param {Object} githubService
     */
    constructor(githubService:Object) {
        this.githubService = githubService;
        this.githubRestClient = this.githubService.getRestClient();
        this.sortOrder = 30;
        this.regexp = new RegExp(`^${specialWords.now}$|^${specialWords.current}$|^${specialWords.start}$`);
    }

    /**
     * @return {number}
     */
    getSortOrder():number {
        return this.sortOrder;
    }

    /**
     * @return {RegExp}
     */
    getRegExp():RegExp {
        return this.regexp;
    }

    /**
     *
     * @param org
     * @param repo
     * @param point
     * @param filter
     * @return {Promise<Date>}
     */
    async getFromDate(org:string, repo:string, point:string, filter:?RegExp):Promise<Date> {
        return this.getDate(org, repo, point, filter);
    }

    /**
     *
     * @param org
     * @param repo
     * @param point
     * @param filter
     * @return {Promise<Date>}
     */
    async getToDate(org:string, repo:string, point:string, filter:?RegExp):Promise<Date> {
        return this.getDate(org, repo, point, filter);
    }

    /**
     * Gets commit from Github and returns commit created date
     *
     * @param {string} org
     * @param {string} repo
     * @param {string} point
     * @param {RegExp} filter
     * @return {Promise<Date|null>}
     */
    async getDate(org:string, repo:string, point:string, filter:?RegExp):Promise<Date> {
        let output;

        switch (point) {
            case specialWords.current: {
                const versions = await this.githubService.getAllTags(org, repo, filter);
                output = addMilliseconds(versions[_.last(Object.keys(versions))].to, 1);
                break;
            }
            case specialWords.now: {
                output = new Date();
                break;
            }
            case specialWords.start: {
                const versions = await this.githubService.getAllTags(org, repo, filter);
                output = versions[Object.keys(versions)[0]].from;
                break;
            }
        }

        return output || null;
    }
}

module.exports = SpecialWords;

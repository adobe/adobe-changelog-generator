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

import type { ReleaseParsersInterface } from '../api/release-parsers-interface.js';

const _ = require('lodash');

class Tag implements ReleaseParsersInterface {
    sortOrder:number;
    regexp:RegExp;
    githubService:Object;

    /**
     * @param {Object} githubService
     */
    constructor(githubService:Object) {
        this.githubService = githubService;
        this.sortOrder = 30;
        this.regexp = /^([\S+]{1,20})$/;
    }

    /**
     * @return {number}
     */
    getSortOrder ():number {
        return this.sortOrder;
    }

    /**
     * @return {RegExp}
     */
    getRegExp ():RegExp {
        return this.regexp;
    }

    /**
     * Gets commit from Github and returns commit created date
     *
     * @param {string} org
     * @param {string} repo
     * @param {string} point
     * @return {Promise<Date|null>}
     */
    async getDate(org:string, repo:string, point:string):Promise<Date> {
        const ref = await this.githubService.git.getRef({owner: org, repo, ref: `tags/${point}`});
        const commit = await this.githubService.git.getCommit({owner: org, repo, commit_sha: ref.data.object.sha});
        return _.get(commit, 'data.committer.date') ?
            new Date(_.get(commit, 'data.committer.date')) :
            null;
    }
}

module.exports = Tag;

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

class Tag implements ReleaseParsersInterface {
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
        this.sortOrder = 40;
        this.regexp = /^([\S+]{1,20})$/;
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
        const versions = await this.githubService.getAllTags(org, repo, filter);
        return versions[point].from;
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
        const ref = await this.githubRestClient.git.getRef({owner: org, repo, ref: `tags/${point}`});
        const tag = await this.githubRestClient.git.getTag({owner: org, repo, tag_sha: ref.data.object.sha})
        const commit = await this.githubRestClient.git.getCommit({owner: org, repo, commit_sha: tag.data.object.sha});
        return _.get(commit, 'data.committer.date') ?
            new Date(_.get(commit, 'data.committer.date')) :
            null;
    }
}

module.exports = Tag;

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
const DynamicFilesLoader = require('./dynamic-files-loader');
class Range {
    githubService:Object
    restGithubClient:Object

    /**
     * @param {Object} githubService
     */
    constructor (githubService:Object) {
  	    this.githubService = githubService;
  	    this.restGithubClient = githubService.getRestClient();
  	    this.dynamicFilesLoader = new DynamicFilesLoader('release-parsers');
  	    this.parsers = [];
    }

    /**
     * Returns all release line parsers
     *
     * @return {Promise<[]>}
     */
    async getParsers():Promise<Array> {
  	    if (!this.parsers.length) {
  		    this.parsers = Object.values(await this.dynamicFilesLoader.getAll());
  		    this.parsers.sort((Next:Object, Prev:Object) =>
  			    (new Next()).getSortOrder() > (new Prev()).getSortOrder()
  		    );
  	    }
  	    return this.parsers;
    }

    /**
     * Converts hash/date/tag/etc to time format
     *
     * @param {string} point
     * @param {string} org
     * @param {string} repo
     * @return {Promise<Date|number|*>}
     */
    async getByPoint(point:string, org:string, repo:string):Number {
  	const parsers = await this.getParsers();

  	for (const Parser of parsers) {
  		const parser = new Parser(this.restGithubClient);
  		const match = point.match(parser.getRegExp());

  		if (match) {
  			return parser.getDate(org, repo, point);
  		}
  	}
    }

    /**
     * Returns "from" - "to" in Date format
     *
     * @param {string} org
     * @param {string} repo
     * @param {string} from
     * @param {string} to
     * @return {Promise<{from: Date, to: Date}>}
     */
    async getRange(org:string, repo:string, from:string, to:string):Object {
  	return {
  		from: await this.getByPoint(from, org, repo),
  		to: await this.getByPoint(to, org, repo)
  	};
    };

    /**
     * Returns repository versions with time ranges that satisfy from to condition
     *
     * @param org
     * @param repo
     * @param from
     * @param to
     * @param filter
     * @param version
     * @return {Promise<*>}
     */
    async getVersions(org:string, repo:string, from:string, to:string, filter?:string, version?:string) {
  	const versions = await this.githubService.getAllTags(org, repo);
  	const versionsList = Object.keys(versions);
  	const mergedTags = {...versions, [version]: {from: versions[versionsList[versionsList.length -1]].to, to}};
  	const fromTimestamp = (new Date(from)).getTime();
  	const toTimestamp = (new Date(to)).getTime();
  	return _.pickBy(mergedTags, (data, name) => {
  		const tagFromTimestamp = (new Date(data.from)).getTime();
  		const tagToTimestamp = (new Date(data.to)).getTime();

  		if (name.match(filter)) {
  			return false;
  		}

  		return (tagFromTimestamp >= fromTimestamp && tagFromTimestamp <= toTimestamp) ||
                 (tagToTimestamp >= fromTimestamp && tagToTimestamp <= toTimestamp) ||
                 (tagFromTimestamp < fromTimestamp && tagToTimestamp > toTimestamp);
  	});
    }
}

module.exports = Range;

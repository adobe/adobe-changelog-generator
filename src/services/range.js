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
const addMilliseconds = require('date-fns').addMilliseconds;

class Range {
    githubService:Object
    restGithubClient:Object
    releasedVersionsCache:Object
    parsers:Array

    /**
     * @param {Object} githubService
     */
    constructor(githubService:Object) {
        this.githubService = githubService;
        this.restGithubClient = githubService.getRestClient();
        this.dynamicFilesLoader = new DynamicFilesLoader('release-parsers');
        this.releasedVersionsCache = {};
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
            this.parsers.sort((Next, Prev) =>
                (new Next(this.githubService)).getSortOrder() - (new Prev(this.githubService)).getSortOrder()
            );
        }
        return this.parsers;
    }

    /**
     * Converts hash/date/tag/etc to time format
     *
     * @param {string} point
     * @param {string} direction
     * @param {string} org
     * @param {string} repo
     * @return {Promise<Date>}
     */
    async getByPoint(point:string, direction:string, org:string, repo:string, filter?:RegExp):Promise<Date | null> {
        const parsers = await this.getParsers();

        for (const Parser of parsers) {
            const parser = new Parser(this.githubService);
            const match = point && point.match(parser.getRegExp());

            if (match && direction === 'from') {
                return parser.getFromDate(org, repo, point, filter);
            }

            if (match && direction === 'to') {
                return parser.getToDate(org, repo, point, filter);
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
    async getRange(org:string, repo:string, from:string, to:string, filter?:RegExp):Object {
        return {
            from: await this.getByPoint(from, 'from', org, repo, filter),
            to: await this.getByPoint(to, 'to', org, repo, filter)
        };
    };

    /**
     *
     * @param toRelease
     * @param org
     * @param repo
     * @param filter
     * @return {Promise<string>}
     */
    async getReleaseVersion(toRelease:string, org:string, repo:string, filter?:string):Promise<string> {
        const regexp = /^major$|^minor$|^patch$/;
        const match = toRelease.match(regexp);
        const versions = await this.getReleasedVersions(org, repo, filter);
        const lastReleased = _.last(Object.keys(versions));

        if (!match) { return toRelease;}

        const lastReleasedSplit = lastReleased.split('.');

        if (
            !Number.isInteger(lastReleasedSplit[0]) ||
            !Number.isInteger(lastReleasedSplit[1]) ||
            !Number.isInteger(lastReleasedSplit[2])
        ) {
            throw new Error(
                `Version ${lastReleased} doesn't follow Semver declaration.\n` +
                `Version autoincrement functionality works only with Semver declaration.`
            );
        }

        switch (match[0]) {
            case 'patch': {
                ++lastReleasedSplit[2];
                break;
            }
            case 'minor': {
                ++lastReleasedSplit[1];
                break;
            }
            case 'major': {
                ++lastReleasedSplit[0];
                break;
            }
        }

        return lastReleasedSplit.join('.');
    }

    /**
     *
     * @param org
     * @param repo
     * @param filter
     * @return {Promise<Object>}
     */
    async getReleasedVersions(org:string, repo:string, filter?:string) {
        const key = org.concat(repo, filter);
        if (!this.releasedVersionsCache[key]) {
            this.releasedVersionsCache[key] = await this.githubService.getAllTags(org, repo, filter);
        }
        return this.releasedVersionsCache[key];
    }

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
        const versions = await this.getReleasedVersions(org, repo, filter);
        const versionsList = Object.keys(versions);
        const lastReleaseVersion = versionsList[versionsList.length - 1];
        const lastReleaseDate = versions[lastReleaseVersion].to;
        const fromTimestamp = (new Date(from)).getTime();
        const toTimestamp = (new Date(to)).getTime();

        if (version) {
            const preparedReleaseVersion = await this.getReleaseVersion(version, org, repo, filter);
            versions[preparedReleaseVersion] = {
                from: addMilliseconds(lastReleaseDate, 1),
                to: (new Date(lastReleaseDate)).getTime() < toTimestamp ? to : new Date()
            };
        }

        return _.pickBy(versions, (data, name) => {
            const tagFromTimestamp = (new Date(data.from)).getTime();
            const tagToTimestamp = (new Date(data.to)).getTime();

            if (filter && name.match(filter)) {
                return false;
            }

            return (tagFromTimestamp >= fromTimestamp && tagFromTimestamp <= toTimestamp) ||
                (tagToTimestamp >= fromTimestamp && tagToTimestamp <= toTimestamp) ||
                (tagFromTimestamp < fromTimestamp && tagToTimestamp > toTimestamp);
        });
    }
}

module.exports = Range;

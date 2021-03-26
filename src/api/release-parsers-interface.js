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

const Octokit = require('@octokit/rest').Octokit;

export interface ReleaseParsersInterface {
    /**
     * @param githubClient
     */
    constructor(githubClient:Octokit):void;

    /**
     * Returns sort order
     */
    getSortOrder():number;

    /**
     * Returns regexp to parse release
     */
    getRegExp():RegExp;

    /**
     * @param org
     * @param repo
     * @param point
     */
    getDate(org:string, repo:string, point:string):Promise<Date>;
}

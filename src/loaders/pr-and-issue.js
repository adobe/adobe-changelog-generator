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

import type { LoaderInterface } from '../api/loader-interface.js';
import type { PullRequestData } from '../models/pullrequest.js';
import type { graphql } from '@octokit/graphql';
const _ = require('lodash');
const PullrequestLoader = require('./pullrequest');
const IssueLoader = require('./issue');

class PrAndIssue implements LoaderInterface {
  githubGraphQlClient:graphql

  /**
   * @ram githubService
   */
  constructor(githubService:graphql) {
      this.pullrequestLoader = new PullrequestLoader(githubService);
      this.issueLoader = new IssueLoader(githubService);
  }

  /**
     * Load data from Github
     *
     * @param organization
     * @param repository
     * @param branch
     * @param from
     * @param to
     * @return {Promise<{createdAt: Object.createdAt, contributionType: Object.contributionType, number: Object.number, author: Object.author.login, organization: string, repository: string, title: Object.title, url: Object.url, labels: Object.labels.nodes}[]>}
     */
  async execute (
  	organization:string,
  	repository:string,
  	branch,
  	from:Date,
  	to:Date
  ):Promise<Array<PullRequestData>> {
      const prs = await this.pullrequestLoader.execute(organization, repository, branch, from, to);
      const issues = await this.issueLoader.execute(organization, repository, branch, from, to);
      return [...prs, ...issues];

  }
}
module.exports = PrAndIssue;

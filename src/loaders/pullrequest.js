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

class PullRequestLoader implements LoaderInterface {
  githubGraphQlClient:graphql

  /**
   * @ram githubService
   */
  constructor(githubService:graphql) {
      this.githubGraphQlClient = githubService.getGraphQlClient();
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
  	const startDate = from.toISOString();
  	const endDate = to.toISOString();
  	let cursor = null;
  	let hasNextPage = null;
  	let after = '';
  	let query = '';
  	let response = null;
  	let result = [];
  	do {
  		after = cursor ? `after:"${cursor}"` : '';
  		query = `{
        search(first: 50, query: "repo:${organization}/${repository} is:pr base:${branch} is:merged merged:${startDate}..${endDate}", type: ISSUE ${after}) {
          nodes {
            ... on PullRequest {
              title
              url
              number
              createdAt
              mergedAt
              labels(first: 100) {
                nodes {
                  name
                }
              }
              author {
                login
                ... on User {
                  id
                  company
                  __typename
                }
                ... on Bot {
                  id
                  login
                  __typename
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`;

  		response = await this.githubGraphQlClient(query);
  		hasNextPage = false;// response.search.pageInfo.hasNextPage
  		cursor = response.search.pageInfo.endCursor;
  		result = [...result, ...response.search.nodes];
  	} while (hasNextPage);

  	const regexpFirst = /\[bot\]/gm;
  	const regexpSecond = /(-|^)bot(-|$)/gm;
  	const regexpThird = /dependabot/gm;
  	result = result.filter((pr) => pr.author &&
        pr.author.login.search(regexpFirst) === -1 &&
        pr.author.login.search(regexpSecond) === -1 &&
        pr.author.login.search(regexpThird) === -1
  	);

  	return result.map((item:Object) => ({
  		repository,
  		organization,
  		title: item.title,
  		url: item.url,
  		author: item.author.login,
  		labels: item.labels.nodes,
  		createdAt: item.createdAt,
          mergedAt: item.mergedAt,
  		contributionType: item.contributionType,
  		number: item.number
  	}));
  }
}
module.exports = PullRequestLoader;

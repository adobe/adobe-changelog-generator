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

/**
 * Class is responsible for loading issue data from Github
 */
class IssueLoader implements LoaderInterface {
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
        search(first: 50, query: "repo:${organization}/${repository} is:issue is:closed closed:${startDate}..${endDate}", type: ISSUE ${after}) {
          nodes {
            ... on Issue {
              number
              title
              url
              labels(first: 100) {
                nodes {
                  name
                }
              }
              author {
                login
              }
              createdAt
              closedAt
              timelineItems(first: 100 itemTypes: [
                CROSS_REFERENCED_EVENT
              ]) {
                edges {
                  node {
                    ... on CrossReferencedEvent {
                      source {
                        ... on PullRequest {
                          title
                          url
                          number
                          createdAt
                          closedAt
                          mergedAt
                          state
                          author {
                            login
                          }
                          repository {
                            name
                            owner {
                              login
                            }
                          }
                        }
                      }
                    }
                  }
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
  		hasNextPage = response.search.pageInfo.hasNextPage;
  		cursor = response.search.pageInfo.endCursor;
  		result = [...result, ...response.search.nodes];
  	} while (hasNextPage);

  	return result.map((item:Object) => ({
  		repository,
  		organization,
  		title: item.title,
  		url: item.url,
  		author: item.author ? item.author.login : 'ghost',
  		createdAt: item.createdAt,
          closedAt: item.closedAt,
  		number: item.number,
          labels: item.labels.nodes,
          mergedAt: item.mergedAt,
          additionalFields: {},
          type: 'issue',
          crossReference: item.timelineItems.edges.length ? item.timelineItems.edges.filter((elem:Object) =>
              elem.node.source.repository
          ).map((elem:Object) => ({
              repository: elem.node.source.repository.name,
              organization: elem.node.source.repository.owner.login,
              number: elem.node.source.number,
              type: 'pullrequest',
              state: elem.node.source.state
          })) : [],
          closer: _.get(item, 'timelineItems.edges[0].node.closer')
  	}));
  }
}
module.exports = IssueLoader;

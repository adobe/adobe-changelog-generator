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

const aioConfig = require('@adobe/aio-lib-core-config');
const { graphql } = require('@octokit/graphql');
const Octokit = require('@octokit/rest').Octokit;

class Github {
  graphqlClient:graphql
  restClient:Octokit
  constructor (token:string):void {
  	this.graphqlClient = graphql.defaults({ headers: { authorization: `token ${token}` } });
  	this.restClient = new Octokit({ auth: `token ${token}` });
  }

  /**
     * Returns all project tags from Github
     *
     * @param {string} org
     * @param {string} repo
     * @return {Promise<{}>}
     */
  async getAllTags (org:string, repo:string) {
  	let query;
  	let cursor = null;
  	let hasNextPage = null;
  	let after = '';
  	let response = null;
  	let result = [];
  	do {
  		after = cursor ? `after:"${cursor}"` : '';
  		query = `
        {
          repository(name: "${repo}", owner: "${org}") {
            refs(refPrefix: "refs/tags/", first: 100, orderBy: {field: TAG_COMMIT_DATE, direction: ASC} ${after}) {
              pageInfo {
                hasNextPage,
                endCursor
              }
              nodes {
                name
                target {
                  ... on Commit {
                    committedDate
                  }
                  ... on Tag {
                    tagger {
                      date
                    }
                  }
                }
              }
            }
          }
        }`;
  		response = await this.graphqlClient(query);
  		hasNextPage = response.repository.refs.pageInfo.hasNextPage;
  		cursor = response.repository.refs.pageInfo.endCursor;
  		result = [...result, ...response.repository.refs.nodes];
  	} while (hasNextPage);

  	const data = {};
  	result.forEach((item, index) => {
  		data[item.name] = {
  			from: result[index - 1] ? data[result[index - 1].name].to : new Date('2000/01/01'),
  			to: new Date(item.target.committedDate || item.target.tagger.date)
  		};
  	});
  	return data;
  }

  /**
     * Returns Github Rest Client
     *
     * @return {Octokit}
     */
  getRestClient () {
  	return this.restClient;
  }

  /**
     * Returns Github GraphQL Client
     *
     * @return {graphql}
     */
  getGraphQlClient () {
  	return this.graphqlClient;
  }
}

module.exports = Github;

import type { LoaderInterface } from '../api/loader-interface.js';
import type { FilterInterface } from '../api/filter-interface.js';
import type { PullRequestData } from '../api/data/pullrequest.js';
import type { graphql } from '@octokit/graphql';

const formatFns = require('date-fns/format');

class PullRequestLoader implements LoaderInterface {
  githubGraphQlClient:graphql
  filters:Array<FilterInterface>
  groupBy:Object
  constructor (
    githubService:graphql,
    filters:Array<FilterInterface> = [],
    groupBy:Object = {}
  ) {
    this.githubGraphQlClient = githubService.getGraphQlClient();
    this.filters = filters;
    this.groupBy = groupBy;
  }

  async execute (
    organization:string,
    repository:string,
    from:Date,
    to:Date
  ):Promise<Array<PullRequestData>> {
    const formatPattern = 'yyyy-MM-dd';
    const sdate = formatFns(from.getTime(), formatPattern);
    const edate = formatFns(to.getTime(), formatPattern);
    let cursor = null;
    let hasNextPage = null;
    let after = '';
    let query = '';
    let response = null;
    let result = [];
    do {
      after = cursor ? `after:"${cursor}"` : '';
      query = `{
        search(first: 50, query: "repo:${organization}/${repository} is:pr is:merged created:${sdate}..${edate}", type: ISSUE ${after}) {
          nodes {
            ... on PullRequest {
              title
              url
              number
              createdAt
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

    for (const filter of this.filters) {
      result = filter.execute(result);
    }

    if (this.groupBy) {
      result = this.groupBy.execute(result);
    }

    return result.map((item:Object) => ({
        repository,
        organization,
        title: item.title,
        url: item.url,
        author: item.author.login,
        labels: item.nodes,
        createdAt: item.createdAt,
        contributionType: item.contributionType,
        number: item.number
    }));
  }
}
module.exports = PullRequestLoader;

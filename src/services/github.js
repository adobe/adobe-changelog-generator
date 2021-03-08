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

  getRestClient () {
    return this.restClient;
  }

  getGraphQlClient () {
    return this.graphqlClient;
  }
}

module.exports = Github;

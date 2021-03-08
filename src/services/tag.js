const _ = require('lodash');
class TagService {
  githubService:Object
  restGithubClient:Object
  constructor (githubService:Object) {
    this.githubService = githubService;
    this.restGithubClient = githubService.getRestClient();
  }

  async getTagDates (tag:string, org:string, repo:string):Object {
    const [start, right] = tag.split('..');
    const [end, sha] = right.split(':SHA:');
    const allRepositoryTags = await this.githubService.getAllTags(org, repo);
    const values = Object.values(allRepositoryTags);
    const keys = Object.keys(allRepositoryTags);
    const result = {};
    let startRange;

    if (start === 'latest') {
      startRange = allRepositoryTags[keys[keys.length - 1]];
    } else {
      startRange = allRepositoryTags[start] || values[0];
    }

    if (!allRepositoryTags[end]) {
      allRepositoryTags[end] = {
        from: _.last(values).to,
        to: !sha
          ? new Date()
          : await this.restGithubClient.git.getCommit({ owner: org, repo, commit_sha: sha })
            .then(res => _.get(res, 'data.committer.date') ? new Date(_.get(res, 'data.committer.date')) : null)
      };
    }
    const endRange = allRepositoryTags[end];
    const filtered = Object.keys(allRepositoryTags).filter(tagname =>
      startRange.from <= allRepositoryTags[tagname].from && endRange.to >= allRepositoryTags[tagname].to
    );
    filtered.reverse().forEach(tagname => { result[tagname] = allRepositoryTags[tagname]; });
    return result;
  }
}

module.exports = TagService;

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

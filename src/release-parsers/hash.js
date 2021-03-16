const _ = require('lodash');
class Hash {
    sortOrder:number;
    regexp:RegExp;
    githubService:Object;

    constructor(githubService:Object) {
        this.githubService = githubService;
        this.sortOrder = 10;
        this.regexp = /\b[0-9a-f]{40}\b/;
    }

    getSortOrder ():number {
        return this.sortOrder;
    }

    getRegExp ():RegExp {
        return this.regexp;
    }

    async getDate(org:string, repo:string, sha:string):Promise<Date> {
        const commit = await this.githubService.git.getCommit({ owner: org, repo, commit_sha: sha });
        return _.get(commit, 'data.committer.date') ?
            new Date(_.get(commit, 'data.committer.date')) :
            null;
    }
}

module.exports = Hash;

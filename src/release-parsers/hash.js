const _ = require('lodash');
class Hash {
    sortOrder:number;
    regexp:RegExp;
    githubService:Object;

    /**
     * @param {Object} githubService
     */
    constructor(githubService:Object) {
    	this.githubService = githubService;
    	this.sortOrder = 10;
    	this.regexp = /\b[0-9a-f]{40}\b/;
    }

    /**
     * @return {number}
     */
    getSortOrder ():number {
    	return this.sortOrder;
    }

    /**
     * @return {RegExp}
     */
    getRegExp ():RegExp {
    	return this.regexp;
    }

    /**
     * Gets commit from Github and returns commit created date
     *
     * @param {string} org
     * @param {string} repo
     * @param {string} sha
     * @return {Promise<Date|null>}
     */
    async getDate(org:string, repo:string, sha:string):Promise<Date> {
    	const commit = await this.githubService.git.getCommit({ owner: org, repo, commit_sha: sha });
    	return _.get(commit, 'data.committer.date') ?
    		new Date(_.get(commit, 'data.committer.date')) :
    		null;
    }
}

module.exports = Hash;

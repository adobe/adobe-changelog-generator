const _ = require('lodash');
const endOfDay = require('date-fns/endOfDay');
const parseISO = require('date-fns/parseISO');

class Date {
    sortOrder:number;
    regexp:RegExp;
    githubService:Object;

    /**
     * @param {Object} githubService
     */
    constructor(githubService:Object) {
    	this.githubService = githubService;
    	this.sortOrder = 20;
    	this.regexp = /^(\d{4}\-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;
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
     * @param {string} point
     * @return {Promise<Date|null>}
     */
    async getDate(org:string, repo:string, point:string):Promise<Date> {
    	return point.split('T')[1] ? parseISO(point) : endOfDay(parseISO(point));
    }
}

module.exports = Date;

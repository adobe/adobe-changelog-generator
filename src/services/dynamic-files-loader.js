const fs = require('fs');
const path = require('path');

class DynamicFilesLoader {
    dir:string;
    cache:Object;

    /**
     * @param {string} dir - path to dir
     */
    constructor(dir:string) {
    	this.dir = dir;
    	this.cache = {};
    }

    /**
     * Loads file from project folder
     *
     * @param name
     * @return {*}
     */
    get(name:string) {
    	if (!this.cache[name]) {
    		this.cache[name] = require(`./${this.dir}/${name}.js`);
    	}
    	return this.cache[name];
    }

    /**
     * Loads files from project folder
     *
     * @return {{}}
     */
    getAll() {
    	const dirname = path.resolve(__dirname, '../src/' + this.dir);
    	const filenames:Array<string> = fs.readdirSync(dirname);
    	const files = {};
    	filenames.forEach((filename:string) => {
    		files[filename] = require(`../release-parsers/${filename}`);
    	});

    	return files;
    }
}

module.exports = DynamicFilesLoader;

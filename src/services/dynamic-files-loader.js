const fs = require('fs');
const path = require('path');
const glob = require('glob');
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

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
            const dirname = path.resolve(__basedir, this.dir);
    		this.cache[name] = requireFunc(`${dirname}/${name}.js`);
    	}
    	return this.cache[name];
    }

    /**
     * Loads files from project folder
     *
     * @return {{}}
     */
    getAll() {
    	const dirname = path.resolve(__basedir, this.dir);
    	const filenames:Array<string> = fs.readdirSync(dirname);
    	const files = {};
    	filenames.forEach(
    	    (filename:string) => {
    	        files[filename.split('.')[0]] = requireFunc(`${dirname}/${filename}`);
            }
        );
    	return files;
    }
}

module.exports = DynamicFilesLoader;

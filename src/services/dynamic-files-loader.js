const fs = require('fs');
const path = require('path');
const vm = require("vm");

class DynamicFilesLoader {
    dir:string;
    cache:Object;
    constructor(dir:string) {
        this.dir = dir;
        this.cache = {};
    }

    get(name:string) {
        if (!this.cache[name]) {
            this.cache[name] = require(`./${this.dir}/${name}.js`);
        }
        return this.cache[name];
    }

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

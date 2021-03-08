import type { FileManagerInterface } from './api/file-manager-interface.js';

const filters = {};
const FileManager:FileManagerInterface = {
  get: (name:string):Function => {
    if (!filters[name]) {
      filters[name] = require(`./filters/${name}.js`);
    }
    return filters[name];
  }
};

module.exports = FileManager;

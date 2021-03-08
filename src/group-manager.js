import type { FileManagerInterface } from './api/file-manager-interface.js';

const groups = {};
const GroupManager:FileManagerInterface = {
  get: (name:string):Function => {
    if (!groups[name]) {
      groups[name] = require(`./groups/${name}.js`);
    }
    return groups[name];
  }
};

module.exports = GroupManager;

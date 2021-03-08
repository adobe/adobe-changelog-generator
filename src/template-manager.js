import type { FileManagerInterface } from './api/file-manager-interface.js';

const templates = {};
const TemplateManager:FileManagerInterface = {
  get: (name:string):Function => {
    if (!templates[name]) {
      templates[name] = require(`./templates/${name}.js`);
    }
    return templates[name];
  }
};

module.exports = TemplateManager;

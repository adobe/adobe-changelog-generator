const pathLib = require('path');
const fs = require('fs');
module.exports = {
  load: (path:string, type:string):JSON | Error => {
      return JSON.parse(fs.readFileSync(
          type === 'relative' ? pathLib.join(process.cwd(), path) : path
      ));
  },

  create: (path:string, data:string):void | Error => {
    fs.writeFile(path, data,  (err:?Error):void => {
      if (err) {throw err;}
    });
  }
};

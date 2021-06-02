/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const pathLib = require('path');
const fs = require('fs');

class File {
    /**
     * Loads file
     * @param {string} path - Path to the file
     * @param {string} type - Type of the path (Absolute|Relative)
     * @return {string|Error}
     */
    load (path:string, type:string):JSON | Error {
        return Buffer.from(fs.readFileSync(
            type === 'relative' ? pathLib.join(process.cwd(), path) : path
        )).toString();
    };

    /**
     * Load JSON file
     *
     * @param {string} path
     * @param {string} type
     * @return {any}
     */
    loadJSON (path:string, type:string):JSON | Error {
        return JSON.parse(Buffer.from(fs.readFileSync(
            type === 'relative' ? pathLib.join(process.cwd(), path) : path
        )).toString());
    }

    /**
     * Creates file
     *
     * @param path
     * @param data
     * @param callback
     */
    create(path:string, data:string, callback?:Function):void | Error {
        fs.writeFile(path, data, (err) => {
            if (callback) {
                callback(err, { path });
            }
        });

    }
}

module.exports = new File();

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
const fs = require('fs');
const pathLib = require('path');

const templates = {};
const templateRegistry = {
    /**
     * Loads template from templates folder by name
     * @param name
     * @return {*}
     */
    get: (name:string):Function => {
        if (!templates[name]) {
            const binary = fs.readFileSync(pathLib.join(__basedir, `/templates/${name}.md`));
            templates[name] = Buffer.from(binary, 'base64').toString('binary');
        }

        return templates[name];
    }
};

module.exports = templateRegistry;

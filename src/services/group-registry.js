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

import type { FileManagerInterface } from '../api/file-manager-interface.js';

const registry = {};
const GroupRegistry:FileManagerInterface = {
    /**
     * Loads group by name
     *
     * @param name
     * @param config
     * @return {Promise<Object|null>}
     */
    get: (name:string, config:Object):Function => {
        if (!name) {
            return null;
        }
        name = name.toLowerCase();
        if (!registry[name]) {
            registry[name] = require(`../groups/${name}.js`);
        }
        return new registry[name](config);
    }
};

module.exports = GroupRegistry;
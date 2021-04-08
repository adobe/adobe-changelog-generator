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
import { graphql } from '@octokit/graphql';

const registry = {};
const LoaderRegistry:FileManagerInterface = {
    /**
     * Loads loader by name
     *
     * @param name
     * @param {{graphql}} githubService TODO: should be removed from parameters
     * @return {Promise<Object|null>}
     */
    get: (name:string, githubService:graphql):Function => {
        if (!name) {
            return null;
        }
        name = name.toLowerCase();
        if (!registry[name]) {
            registry[name] = require(`../loaders/${name}.js`);
        }
        return new registry[name](githubService);
    }
};

module.exports = LoaderRegistry;

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

class GithubNamespaceParser {
    /**
     * Parses namespace pattern. Namespace example: adobe/adobe-changelog-generator:master
     *
     * @param {string} namespace
     * @return {{organization: string, repository: string, branch: string}} | Error
     */
    parse(namespace:string):Object | Error {
        const parsed:Array<string> = namespace.match(/(.*)\/(.*):(.*)/) || [];

        if (!parsed[1] || !parsed[2] || !parsed[3]) {
            throw new Error(`
            The namespace pattern is broken, please configure namespace in correct pattern.
            Pattern example: <organization>/<repository>:branch
        `);
        }

        return {
            organization: parsed[1],
            repository: parsed[2],
            branch: parsed[3]
        };
    }
}

module.exports = GithubNamespaceParser;

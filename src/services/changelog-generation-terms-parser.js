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

// TODO: interface "must have"
class ChangelogGenerationTermsParser {
    /**
     * Parses changelog generation terms. Example: <type>..<type>@<version>:<regexp>
     *
     * @param {string} terms
     * @return {{filter: string, from: string, to: string, version: string}}
     */
    parse(terms: string): Object | Error {
        let match, filter, version, from, to;
        [match, filter] = terms.split(':');
        [match, version] = match.split('@');
        [from, to] = match.split('..');

        return {from, to, version, filter};
    }
}

module.exports = ChangelogGenerationTermsParser;

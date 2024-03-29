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

import type { ChangelogWriterInterface } from '../api/changelog-writer-interface.js';

const fileService = require('../services/file');

class Json implements ChangelogWriterInterface {
    /**
     * Write changelog data JSON format to file
     *
     * @param {Array<string>} changelogData
     * @param {Object} config
     * @param callback
     * @return void
     */
    async write(changelogData:Array<string>, config:Object, callback:?Function) {
        fileService.create(
            `${config.getProjectPath()}/${config.getFilename()}.json`,
            JSON.stringify(changelogData)
        );

        if (callback) {
            callback(null, {
                filename: `${config.getFilename()}.json`,
                path: `${config.getProjectPath()}`
            });
        }
    }
}

module.exports = Json;

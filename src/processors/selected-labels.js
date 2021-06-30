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

class SelectedLabels {
    /**
     * @param config
     */
    constructor(config:Object) {
        this.config = config;
    }

    /**
     * @param data
     * @return {Promise<Object[]>}
     */
    async execute(data:Array<Object>) {
        if (!this.config.componentLabelRegExp) {
            throw new Error(
                '"selected-labels" processor error: required option "componentLabelRegExp" is not provided'
            );
        }

        return data.map((item:Object) => {
            if (item.labels) {
                item.additionalFields[this.config.field] = item.labels
                    .map((label:Object) => label.name)
                    .filter((label:string) => !!label.match(this.config.componentLabelRegExp));
            }

            return item;
        });
    }
}

module.exports = SelectedLabels;

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

const fileService = require('../services/file');
const sample = {
    short: {
        "<organization>/<repository>:<branch>": {
            "releaseLine": "<from>..<to>",
            "loader": {
                "name": "pullrequest",
            }
        }
    },
    long: {
        "<organization>/<repository>:<branch>": {
            "releaseLine": "<from>..<to>@<version>:<filter>",
            "combine": {
                "<organization>/<repository>:<branch>": {
                    "releaseLine": "<from>..<to>@<version>:<filter>"
                },
                "loader": {
                    "name": "<loader-name>",
                    "config": {
                        "exclude": {
                            "<filter>": "<filter-config>"
                        },
                        "groupBy": {
                            "name": "<group-name>",
                            "config": {}
                        }
                    }
                },
                "output": {
                    "strategy": "<strategy-type>",
                    "template": "<template-name>",
                    "filename": "<file-name>",
                    "projectPath": "<project-path>"
                }
            },
        }
    }
}

class ConfigGenerator {
    generateConfigSample(type:string, path:string): Promise {
        return new Promise((resolve, reject) => {
            if (!sample[type]) {
                reject(new Error(`Sample type ${type} does not exist`))
            }
            fileService.create(path, JSON.stringify(sample[type], null, 4), (error:Error, data:Object) => error ?
                reject(error) :
                resolve(data)
            );
        })
    }
}

module.exports = ConfigGenerator;

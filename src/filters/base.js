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

import type { FilterInterface } from '../api/filter-interface.js';
import type { PullRequestData } from '../models/pullrequest.js';

const _ = require('lodash');
const FilterConditionService = require('../services/filter-condition');

class Base implements FilterInterface {
    /**
     *
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.filterConditionService = new FilterConditionService();
    }

    /**
     * Filters data by specific labels
     *
     * @param data
     * @return {Array<PullRequestData>|PullRequestData[]}
     */
    execute (data:Array<PullRequestData>):Array<PullRequestData> {
        const conditions = _.isArray(this.config.conditions[0]) ?
            this.config.conditions :
            [this.config.conditions];
        if (this.config.level) {
            data.forEach((elem:Object) => {
                if (!_.get(elem, this.config.level)) {
                    throw new Error(
                        `Cannot find field "${this.config.level}".
                         Please check "level" property of filter configuration`
                    );
                }
                _.set(
                    elem,
                    this.config.level,
                    _.get(elem, this.config.level)
                        .filter((item:Object) => this.filterConditionService.isSatisfyingOrConditions(item, conditions))
                );
            });
        } else {
            data = data.filter((item:Object) => this.filterConditionService.isSatisfyingOrConditions(item, conditions));
        }
        return data;
    }
}

module.exports = Base;

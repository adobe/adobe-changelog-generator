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
const _ = require('lodash');

class FilterCondition {
    /**
     * Map config conditions to executable code
     *
     * @param value
     * @param config
     * @return {boolean}
     */
    getCondition(value, config) {
        switch (config.condition) {
            case 'is': {
                if (_.isBoolean(config.value)) {
                    return _.isArray(value) ? !!value.length : !!value;
                }

                return value === config.value;
            }
            case 'is not': {
                if (_.isBoolean(config.value)) {
                    return _.isArray(value) ? !value.length : !value;
                }

                return value !== config.value;
            }
            case 'in':
                return _.includes(config.value, value);
            case 'not in':
                return !_.includes(config.value, value);
            default:
                throw new Error(`Condition ${config.condition} is not supported`);
        }
    }

    /**
     * Check is "OR" condition satisfied
     *
     * @param item
     * @param conditions
     * @return Boolean
     */
    isSatisfyingOrConditions(item:Object, conditions:Array):Boolean {
        const result = [];
        conditions.forEach((conditions:Array) => result.push(this.isSatisfyingAndConditions(item, conditions)));
        return _.some(result);
    }

    /**
     * Check is "AND" condition satisfied
     *
     * @param item
     * @param conditions
     * @return Boolean
     */
    isSatisfyingAndConditions(item:Object, conditions:Array):Boolean {
        const result = [];
        conditions.forEach((condition:Object) => result.push(this.getCondition(item[condition.where], condition)));
        return _.every(result);
    }
}

module.exports = FilterCondition;

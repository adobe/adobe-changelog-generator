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
import type { PullRequestData } from '../api/data/pullrequest.js';

class LabelsFilter implements FilterInterface {
    labels:Array<string>
    constructor (labels:Array<string>) {
    	this.labels = labels;
    }

    /**
     * @param data
     * @return {Array<PullRequestData>|PullRequestData[]}
     */
    execute (data:Array<PullRequestData>):Array<PullRequestData> {
    	if (!this.labels.length) {
    		return data;
    	}
    	return data.filter((item:PullRequestData) => {
    		if (!item.labels) {
    			return true;
    		}

    		for (let i = 0; i < this.labels.length; i++) {
    			if (item.labels.map(labelItem => labelItem.name).includes(this.labels[i])) {
    				return false;
    			}
    		}
    		return true;
    	});
    }
}

module.exports = LabelsFilter;

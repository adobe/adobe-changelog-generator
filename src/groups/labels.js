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

import type { PullRequestData } from '../api/data/pullrequest.js';
const _ = require('lodash');

class LabelsGroup {
    map:Object
    constructor (map:Object) {
      this.map = map;
    }

    execute (data:Array<PullRequestData>):Array<PullRequestData> {
      if (!Object.keys(this.map).length) {
        return data;
      }

      return data.map((item:PullRequestData) => {
        const temp = [];
        Object.keys(this.map).forEach((type:string) => {
          if (
            this.map[type].filter(label => _.includes(item.labels.map(data => data.name), label)).length
          ) {
            temp.push(type);
          }
        });
        item.contributionType = temp.join(', ');
        return item;
      });
    }
}

module.exports = LabelsGroup;

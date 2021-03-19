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
const formatFns = require('date-fns/format');

module.exports = (data:Object):string => {
    let result = '';
    Object.keys(data).forEach((np) => {
        result += namespaceTemplate(np);
        Object.keys(data[np]).forEach((tag:string) => {
            result += tagTemplate(tag, data[np][tag].to);
            const contributionType = _.groupBy(data[np][tag].data, 'contributionType');
            Object.keys(contributionType).forEach((type:string) => {
                result += contributionTypeTemplate(type);
                contributionType[type].forEach(pr => {
                    result += contributionTemplate(pr.organization, pr.repository, pr.number, pr.title, pr.author);
                });
            });
        });
    });

    return result;
};

const namespaceTemplate = (namespace:string) => `
  \n${namespace}
  =============`;

const tagTemplate = (tag:string, creationDate:Date) => `
  ## ${tag} (${formatFns((new Date(creationDate)).getTime(), 'yyyy-MM-dd')})`;

const contributionTypeTemplate = (contributionType:string) => `
  ### ${contributionType}
`;
const contributionTemplate = (org:string, repo:string, number:number, description:string, author:string) => `
  * [${org}/${repo}#${number}](https://github.com/${org}/${repo}/pull/${number})
  -- ${description} by [@${author}](https://github.com/${author})`;

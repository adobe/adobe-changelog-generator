const _ = require('lodash');
const formatFns = require('date-fns/format');

module.exports = (data:Object):string => {
  let result = '';
  Object.keys(data).forEach((np) => {
    result += namespaceTemplate(np);
    Object.keys(data[np]).forEach((tag:string) => {
      result += tagTemplate(tag, data[np][tag].createdAt);
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
  ## ${tag} (${formatFns(creationDate.getTime(), 'yyyy-MM-dd')})`;

const contributionTypeTemplate = (contributionType:string) => `
  ### ${contributionType}
`;
const contributionTemplate = (org:string, repo:string, number:number, description:string, author:string) => `
  * [${org}/${repo}#${number}](https://github.com/${org}/${repo}/pull/${number})
  -- ${description} by [@${author}](https://github.com/${author})`;

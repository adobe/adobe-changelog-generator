import type { FilterInterface } from '../api/filter-interface.js';
import type { PullRequestData } from '../api/data/pullrequest.js';

class LabelsFilter implements FilterInterface {
  labels:Array<string>
  constructor (labels:Array<string>) {
    this.labels = labels;
  }

  execute (data:Array<PullRequestData>):Array<PullRequestData> {
    if (!this.labels.length) {
      return data;
    }
    return data.filter((item:PullRequestData) => {
      if (!item.labels) {
        return true;
      }

      for (let i = 0; i < this.labels.length; i++) {
        if (item.labels.nodes.map(labelItem => labelItem.name).includes(this.labels[i])) {
          return false;
        }
      }
      return true;
    });
  }
}

module.exports = LabelsFilter;

import { FilterInterface } from './filter-interface.js';
import type { PullRequestData } from './data/pullrequest.js';
import { graphql } from '@octokit/graphql';

export interface LoaderInterface {
  constructor(
    githubClient:graphql,
    filters:Array<FilterInterface>,
    groupBy:Object
  ):void,
  execute(
    organization:string,
    repository:string,
    from:Date,
    to:Date,
  ):Promise<Array<PullRequestData>>
}

import type { PullRequestData } from './data/pullrequest.js';

export interface FilterInterface {
    constructor(props:Array<string>):void,
    execute(data:Array<PullRequestData>):Array<PullRequestData>
}

type author = {
    login:string,
    id:string,
    company:null,
    __typename:string
}
type label = {
    name:string
}

type labels = {
    nodes:Array<label>
}

export type PullRequestData = {
  title:string,
  url:string,
  number:number,
  createdAt:string,
  labels:labels,
  author:author,
  contributionType:string
}

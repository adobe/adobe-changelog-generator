const Base = require('../../src/filters/base');
const data = [
    {
        organization: 'org-include',
        repository: 'repo-1',
        number: 1001,
    },
    {
        organization: 'org-exclude',
        repository: 'repo-2',
        number: 1002
    },
    {
        organization: 'org-include',
        repository: 'repo-1',
        number: 1003
    },
    {
        organization: 'org-exclude-1',
        repository: 'repo-3',
        number: 1004
    },
    {
        organization: 'org-exclude',
        repository: 'repo-3',
        number: 1005
    }
];

const dataFilterInside = [
    {
        repository: 'repo-1',
        organization: 'org-1',
        number: 1006,
        insideList: [
            {
                property: 1,
                num: 2
            },
            {
                property: 2,
                num: 3
            },
            {
                property: 2,
                num: 4
            },
            {
                property: 3,
                num: 6
            }
        ]
    }
]

describe('Check "execute"', () => {
    it('Check "not in" condition', async () => {
        const base = new Base({
           conditions: [
               {
                   "where": "organization",
                   "condition": "not in",
                   "value": ["org-exclude", "org-exclude-1"]
               }
           ]
        });
        expect(base.execute(data)).toStrictEqual([
            {
                organization: 'org-include',
                repository: 'repo-1',
                number: 1001
            },
            {
                organization: 'org-include',
                repository: 'repo-1',
                number: 1003
            }
        ]);
    })
    it('Check "in" condition', async () => {
        const base = new Base({
            conditions: [
                {
                    "where": "organization",
                    "condition": "in",
                    "value": ["org-exclude", "org-exclude-1"]
                }
            ]
        });
        expect(base.execute(data)).toStrictEqual([
            {
                organization: 'org-exclude',
                repository: 'repo-2',
                number: 1002
            },
            {
                organization: 'org-exclude-1',
                repository: 'repo-3',
                number: 1004
            },
            {
                organization: 'org-exclude',
                repository: 'repo-3',
                number: 1005
            }
        ]);
    })
    it('Check "is" condition', async () => {
        const base = new Base({
            conditions: [
                {
                    "where": "organization",
                    "condition": "is",
                    "value": "org-exclude-1"
                }
            ]
        });
        expect(base.execute(data)).toStrictEqual([
            {
                organization: 'org-exclude-1',
                repository: 'repo-3',
                number: 1004
            }
        ]);
    })
    it('Check "is" not condition', async () => {
        const base = new Base({
            conditions: [
                {
                    "where": "organization",
                    "condition": "is not",
                    "value": "org-exclude-1"
                }
            ]
        });
        expect(base.execute(data)).toStrictEqual([
            {
                organization: 'org-include',
                repository: 'repo-1',
                number: 1001
            },
            {
                organization: 'org-exclude',
                repository: 'repo-2',
                number: 1002
            },
            {
                organization: 'org-include',
                repository: 'repo-1',
                number: 1003
            },
            {
                organization: 'org-exclude',
                repository: 'repo-3',
                number: 1005
            }
        ]);
    })
    it('Check "AND" condition', async () => {
        const base = new Base({
            conditions: [
                {
                    "where": "organization",
                    "condition": "is not",
                    "value": "org-exclude-1"
                },
                {
                    "where": "repository",
                    "condition": "is",
                    "value": "repo-3"
                }
            ]
        });
        expect(base.execute(data)).toStrictEqual([
            {
                organization: 'org-exclude',
                repository: 'repo-3',
                number: 1005
            }
        ]);
    })
    it('Check "OR" condition', async () => {
        const base = new Base({
            conditions: [
                [
                    {
                        "where": "organization",
                        "condition": "is not",
                        "value": "org-exclude-1"
                    },
                    {
                        "where": "repository",
                        "condition": "is",
                        "value": "repo-3"
                    }
                ],
                [
                    {

                        "where": "repository",
                        "condition": "is",
                        "value": "repo-2"
                    }
                ]
            ]
        });
        expect(base.execute(data)).toStrictEqual([
            {
                organization: 'org-exclude',
                repository: 'repo-2',
                number: 1002
            },
            {
                organization: 'org-exclude',
                repository: 'repo-3',
                number: 1005
            }
        ]);
    })
    it('Check inside level', async () => {
        const base = new Base({
            level: 'insideList',
            conditions: [
                {
                    "where": "property",
                    "condition": "is",
                    "value": 2
                }
            ]
        });
        expect(base.execute(dataFilterInside)).toStrictEqual([
            {
                repository: 'repo-1',
                organization: 'org-1',
                number: 1006,
                insideList: [
                    {
                        property: 2,
                        num: 3
                    },
                    {
                        property: 2,
                        num: 4
                    }
                ]
            }
        ]);
    })
})

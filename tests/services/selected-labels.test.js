const SelectedLabels = require('../../src/processors/selected-labels');
const data = [
    {
        organization: 'org-include',
        repository: 'repo-1',
        labels: [{name:'Component: TestComponent-1'}, {name:'Priority: P2'}, {name:'Type: PullRequest'}],
        number: 1001,
        additionalFields: {}
    }
]

describe('Check "execute"', () => {
    it('Check "Component" labels', async () => {
        const selectedLabels = new SelectedLabels({
            "name": "selected-labels",
            "field": "components",
            "componentLabelRegExp": "(Component:)(.*)"
        });
        expect(await selectedLabels.execute(data)).toStrictEqual([
            {
                organization: 'org-include',
                repository: 'repo-1',
                labels: [{name:'Component: TestComponent-1'}, {name:'Priority: P2'}, {name:'Type: PullRequest'}],
                number: 1001,
                additionalFields: {
                    components: ['Component: TestComponent-1']
                },
            }
        ]);
    })
})

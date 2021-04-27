const TemplateEngine = require('../../src/services/template-engine');
const templateEngine = new TemplateEngine();
const template =
`<!--repeat_namespaces-->
{{namespace}}
=============
<!--repeat_releases-->
## {{tag}} ({{created_at|date_format:dd-MM-yy}}) {{repository}} or {{organization}} or {{branch}}
<!--repeat_contributionTypes-->
### {{contribution_type}}
<!--repeat_items-->
* [{{organization}}/{{repository}}#{{number}}](https://github.com/{{organization}}/{{repository}}/pull/{{number}})
-- {{title}} by [@{{author}}](https://github.com/{{author}})
<!--repeat_items_end-->
<!--repeat_contributionTypes_end-->
<!--repeat_releases_end-->
<!--repeat_namespaces_end-->`;

describe('findRepeat', () => {
    it('Successfully find top level repeat', async () => {
        const repeatPart = await templateEngine.findRepeat(template);
        expect(repeatPart.template).toBeTruthy();
        expect(repeatPart.startRepeatIndexFrom).toBe(0);
        expect(repeatPart.startRepeatIndexTo).toBe(24);
    })
})

describe('generateByTemplate', () => {
    it('Successfully find top level repeat', async () => {
        const repeatPart = await templateEngine.generateByTemplate(
            template,
            {
                "adobe/adobe-release-generator:master": {
                    "1.0": {
                        "from": new Date("2014-08-01T17:05:15.000Z"),
                        "to": new Date("2014-08-01T17:05:15.000Z"),
                        "data": [
                            {
                                "repository": "adobe-release-generator",
                                "organization": "adobe",
                                "title": "Test PR",
                                "author": "John Doe",
                                "labels": [],
                                "createdAt": new Date(),
                                "mergedAt":	new Date(),
                                "contributionType": "bug",
                                "number": 1
                            }
                        ]
                    }
                }
            }
        );
        expect(repeatPart).toBe(`
adobe/adobe-release-generator:master
=============

## 1.0 (01-08-14) adobe-release-generator or adobe or master

### bug

* [adobe/adobe-release-generator#1](https://github.com/adobe/adobe-release-generator/pull/1)
-- Test PR by [@John Doe](https://github.com/John Doe)
`)})
})

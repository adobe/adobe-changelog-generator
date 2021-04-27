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

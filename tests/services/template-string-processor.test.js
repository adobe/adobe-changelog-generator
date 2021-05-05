const TemplateStringProcessor = require('../../src/services/template-string-processor');
const templateStringProcessor = new TemplateStringProcessor();
const variables = {
    organization: 'adobe',
    repository: 'adobe-release-note-generator',
    title: 'Test title',
    author: 'John-Doe',
    number: 1
};

describe('evaluateStringTemplate', () => {
    it('Successfully evaluating string template', async () => {
        const evaluatedString = await templateStringProcessor.evaluateStringTemplate(`
            * [{{organization}}/{{repository}}#{{number}}](https://github.com/{{organization}}/{{repository}}/pull/{{number}})
            -- {{title}} by [@{{author}}](https://github.com/{{author}})
        `, variables);
        expect(evaluatedString).toBe(`
            * [adobe/adobe-release-note-generator#1](https://github.com/adobe/adobe-release-note-generator/pull/1)
            -- Test title by [@John-Doe](https://github.com/John-Doe)
        `);
    })
})

describe('parseStringTemplate', () => {
    it('Successfully parse string template', async () => {
        const parsedTemplate = await templateStringProcessor.parseStringTemplate(`
            * [{{organization}}/{{repository}}#{{number}}](https://github.com/{{organization}}/{{repository}}/pull/{{number}})
            -- {{title}} by [@{{author}}](https://github.com/{{author}})
        `);
        expect(Array.isArray(parsedTemplate.literals)).toBeTruthy();
        expect(parsedTemplate.literals.length).toBe(10);
        expect(Array.isArray(parsedTemplate.variables)).toBeTruthy();
        expect(parsedTemplate.variables.length).toBe(9);
        expect(parsedTemplate.variables[0].name).toBe('organization');
        expect(parsedTemplate.variables[1].name).toBe('repository');
    })
})

describe('evaluateParsedTemplate', () => {
    it('Successfully parse string template', async () => {
        const parsedTemplate = await templateStringProcessor.parseStringTemplate(`
            * [{{organization}}/{{repository}}#{{number}}](https://github.com/{{organization}}/{{repository}}/pull/{{number}})
            -- {{title}} by [@{{author}}](https://github.com/{{author}})
        `);
        const evaluatedTemplate = await templateStringProcessor.evaluateParsedTemplate(parsedTemplate, variables);
        expect(evaluatedTemplate).toBe(`
            * [adobe/adobe-release-note-generator#1](https://github.com/adobe/adobe-release-note-generator/pull/1)
            -- Test title by [@John-Doe](https://github.com/John-Doe)
        `);
    })
})

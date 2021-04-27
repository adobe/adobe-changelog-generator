const CaseConvertor = require('../../src/services/case-convertor');
const caseConvertor = new CaseConvertor();

describe('convertPascalToUnderscore', () => {
    it('Successfully convert pascal case to underscore', async () => {
        expect(caseConvertor.convertPascalToUnderscore('PascalCase')).toBe('pascal_case');
    })
})
describe('convertPascalToDash', () => {
    it('Successfully convert pascal case to dash', async () => {
        expect(caseConvertor.convertPascalToDash('PascalCase')).toBe('pascal-case');
    })
})

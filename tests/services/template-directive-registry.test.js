const TemplateDirectiveRegistry = require('../../src/services/template-directive-registry');
const DynamicFilesLoader = require('../../src/services/dynamic-files-loader');
const CaseConvertor = require('../../src/services/case-convertor');
const dynamicFilesLoaderMock = require('../mocks/dynamic-files-loader');
const caseConvertorMock = require('../mocks/case-convertor');
jest.mock('../../src/services/dynamic-files-loader', () => jest.fn());
jest.mock('../../src/services/case-convertor', () => jest.fn());
DynamicFilesLoader.mockImplementation(() => ({
    getAll: dynamicFilesLoaderMock.getAllMock,
    get: dynamicFilesLoaderMock.get
}));
CaseConvertor.mockImplementation(() => ({
    convertPascalToDash: caseConvertorMock.convertPascalToDash,
    convertPascalToUnderscore: caseConvertorMock.convertPascalToUnderscore
}));
const templateDirectiveRegistry = new TemplateDirectiveRegistry();

describe('getAll', () => {
    beforeEach(() => {
        DynamicFilesLoader.mockClear();
        dynamicFilesLoaderMock.getAllMock.mockClear();
    });

    it('Successfully loading all template directives', async () => {
        const directives = await templateDirectiveRegistry.getAll();
        expect(dynamicFilesLoaderMock.getAllMock).toHaveBeenCalledTimes(1);
        expect(caseConvertorMock.convertPascalToUnderscore).toHaveBeenCalledTimes(Object.keys(directives).length + 1);
    })
})

describe('get', () => {
    beforeEach(() => {
        DynamicFilesLoader.mockClear();
        dynamicFilesLoaderMock.get.mockClear();
    });

    it('Successfully loading all template directives', async () => {
        const directive = await templateDirectiveRegistry.get();
        expect(dynamicFilesLoaderMock.get).toHaveBeenCalledTimes(1);
        expect(directive).toBe(dynamicFilesLoaderMock.parserFirst);
    })
})

const TemplateHandlerRegistry = require('../../src/services/template-handler-registry');
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
const templateHandlerRegistry = new TemplateHandlerRegistry();

describe('get', () => {
    beforeEach(() => {
        DynamicFilesLoader.mockClear();
        dynamicFilesLoaderMock.get.mockClear();
    });

    it('Successfully loading all template directives', async () => {
        const directive = await templateHandlerRegistry.get('parserFirsts');
        expect(dynamicFilesLoaderMock.get).toHaveBeenCalledTimes(1);
        expect(caseConvertorMock.convertPascalToDash).toHaveBeenCalledWith('parserFirst');
    })
})

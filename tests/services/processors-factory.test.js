const ProcessorsFactory = require('../../src/services/processor-factory');
const DynamicFilesLoader = require('../../src/services/dynamic-files-loader');
const CaseConvertor = require('../../src/services/case-convertor');
const dynamicFilesLoaderMock = require('../mocks/dynamic-files-loader');
const caseConvertorMock = require('../mocks/case-convertor');
jest.mock('../../src/services/dynamic-files-loader', () => jest.fn());
jest.mock('../../src/services/case-convertor', () => jest.fn());
DynamicFilesLoader.mockImplementation(() => ({
    get: dynamicFilesLoaderMock.get
}));
CaseConvertor.mockImplementation(() => ({
    convertPascalToDash: caseConvertorMock.convertPascalToDash,
    convertPascalToUnderscore: caseConvertorMock.convertPascalToUnderscore
}));
const processorFactory = new ProcessorsFactory();

describe('get', () => {
    beforeEach(() => {
        DynamicFilesLoader.mockClear();
        dynamicFilesLoaderMock.get.mockClear();
    });

    it('Successfully loading all template directives', async () => {
        const processor = await processorFactory.get();
        expect(dynamicFilesLoaderMock.get).toHaveBeenCalledTimes(1);
        expect(processor).toStrictEqual(new dynamicFilesLoaderMock.parserFirst());
    })
})

const TemplateEngine = require('../../src/services/template-engine');
const TemplateRegistry = require('../../src/services/template-registry');
const fileService = require('../../src/services/file');
const fileMock = require('../mocks/file');
const templateEngineMock = require('../mocks/template-engine');
const templateRegistryMock = require('../mocks/template-registry');
jest.mock('../../src/services/template-engine', () => jest.fn());
jest.mock('../../src/services/template-registry', () => jest.fn());
jest.mock('../../src/services/file', () => jest.fn());
TemplateEngine.mockImplementation(() => ({generateByTemplate: templateEngineMock.generateByTemplate}));
TemplateRegistry.get = templateRegistryMock.get;
fileService.create = fileMock.create;
const Md = require('../../src/writers/md');

describe('write', () => {
    beforeEach(() => {
        TemplateEngine.mockClear();
        TemplateRegistry.mockClear();
        templateRegistryMock.get.mockClear();
        templateEngineMock.generateByTemplate.mockClear();
    });
    it('Successfully write with create strategy', async () => {
        const md = new Md();
        const config = {
            getStrategy: jest.fn(() => 'create'),
            getProjectPath: jest.fn(() => 'path'),
            getFilename: jest.fn(() => 'changelog'),
            getTemplate: jest.fn(() => 'template')
        }
        await md.write([], config);
        expect(config.getTemplate).toHaveBeenCalledTimes(1)
        expect(templateRegistryMock.get).toHaveBeenCalledTimes(1)
        expect(templateEngineMock.generateByTemplate).toHaveBeenCalledTimes(1)
        expect(config.getStrategy).toHaveBeenCalledTimes(1);
        expect(fileService.create).toHaveBeenCalledTimes(1);
    })
    it('Successfully write with merge strategy', async () => {
        const md = new Md();
        const config = {
            getStrategy: jest.fn(() => 'merge'),
            getProjectPath: jest.fn(() => 'path'),
            getFilename: jest.fn(() => 'changelog'),
            getTemplate: jest.fn(() => 'template')
        }
        md.merge = jest.fn(() => 'mock merge method');
        await md.write([], config);
        expect(config.getTemplate).toHaveBeenCalledTimes(1)
        expect(templateRegistryMock.get).toHaveBeenCalledTimes(1)
        expect(templateEngineMock.generateByTemplate).toHaveBeenCalledTimes(1)
        expect(config.getStrategy).toHaveBeenCalledTimes(2);
        expect(md.merge).toHaveBeenCalledTimes(1);
    })
})

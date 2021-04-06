const ConfigLoader = require('../../src/services/config-loader');
const configFixture = require('../fixture/config.json');
const githubService = require('../mocks/github-service');
const path = require('path');
//TODO: Mock configuration
const configLoader = new ConfigLoader(githubService.githubServiceMock, {});

describe('GetLocalConfig', () => {
    it('Successfully loading config with relative path', async () => {
        const actual = await configLoader.getLocalConfig(
            './tests/fixture/config.json',
            'relative'
        );
        expect(actual).toBeTruthy();
        expect(actual).toEqual(configFixture);
    })
    it('Successfully loading config with absolute path', async () => {
        const actual = await configLoader.getLocalConfig(
            path.join(process.cwd(), './tests/fixture/config.json')
        );
        expect(actual).toBeTruthy();
        expect(actual).toEqual(configFixture);
    })
    it('Check wrong path error', async () => {
        try {
            await configLoader.getLocalConfig('/file_not_exits.json');
        } catch (err) {
            expect(err.code).toBe("ENOENT");
        }
    })
})
describe('GetRepositoryConfig', () => {
    beforeEach(() => {githubService.getContentMock.mockClear()});

    it('Check loading is started and successfully parsed', async () => {
        const actual = await configLoader.getRepositoryConfig(
            'adobe/adobe-changelog-generator:master',
            '/.github/changelog.json'
        );

        expect(actual).toStrictEqual(githubService.getContentMockResult);
        expect(githubService.getContentMock).toHaveBeenCalledTimes(1);
    })
})

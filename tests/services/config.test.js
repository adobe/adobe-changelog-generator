const ConfigService = require('../../src/services/config');
const configFixture = require('../fixture/config.json');
const githubService = require('../mocks/github-service');
const path = require('path');
const configService = new ConfigService(githubService.githubServiceMock, {});

describe('ParseNamespace', () => {
    it('Check successful result', () => {
        const parsed = configService.parseNamespace('adobe/adobe-changelog-generator:master');
        expect(parsed.organization).toBeTruthy();
        expect(parsed.repository).toBeTruthy();
        expect(parsed.branch).toBeTruthy();
        expect(parsed.organization).toBe('adobe');
        expect(parsed.repository).toBe('adobe-changelog-generator');
        expect(parsed.branch).toBe('master');
    })
    it('Check missing branch error', () => {
        expect(() => configService.parseNamespace('adobe/adobe-changelog-generator')).toThrow()
    })
    it('Check missing branch error with separator', () => {
        expect(() => configService.parseNamespace('adobe/adobe-changelog-generator:')).toThrow()
    })
    it('Check missing organization error', () => {
        expect(() => configService.parseNamespace('adobe-changelog-generator:master')).toThrow()
    })
    it('Check missing organization with separator error', () => {
        expect(() => configService.parseNamespace('/adobe-changelog-generator:master')).toThrow()
    })
    it('Check missing repository with separator error', () => {
        expect(() => configService.parseNamespace('adobe/:master')).toThrow()
    })
})
describe('ParseReleaseLine', () => {
    it('Check successful with all param passed', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1@2.4.2:regExp');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeTruthy();
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('2.4.1');
        expect(parsed.version).toBe('2.4.2');
        expect(parsed.filter).toBe('regExp');
    })
    it('Check successful without filter', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1@2.4.2');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeFalsy();
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('2.4.1');
        expect(parsed.version).toBe('2.4.2');
    })
    it('Check successful without filter with ":" separator', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1@2.4.2:');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeFalsy();
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('2.4.1');
        expect(parsed.version).toBe('2.4.2');
    })
    it('Check successful without version', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1:regExp');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeTruthy();
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.version).toBe('patch');
        expect(parsed.to).toBe('2.4.1');
        expect(parsed.filter).toBe('regExp');
    })
    it('Check successful without version with "@" separator', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1@:regExp');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeTruthy();
        expect(parsed.version).toBe('patch');
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('2.4.1');
        expect(parsed.filter).toBe('regExp');
    })
    it('Check successful without version and filter', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeFalsy();
        expect(parsed.version).toBe('patch');
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('2.4.1');
    })
    it('Check successful without version and filter with separators', () => {
        const parsed = configService.parseReleaseLine('2.3.4..2.4.1@:');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeFalsy();
        expect(parsed.version).toBe('patch');
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('2.4.1');
    })
    it('Check successful without "to" with separator', () => {
        const parsed = configService.parseReleaseLine('2.3.4..@2.4.2:regExp');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeTruthy();
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('now');
        expect(parsed.version).toBe('2.4.2');
        expect(parsed.filter).toBe('regExp');
    })
    it('Check successful without "to"', () => {
        const parsed = configService.parseReleaseLine('2.3.4@2.4.2:regExp');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeTruthy();
        expect(parsed.from).toBe('2.3.4');
        expect(parsed.to).toBe('now');
        expect(parsed.version).toBe('2.4.2');
        expect(parsed.filter).toBe('regExp');
    })
    it('Check successful without "from"', () => {
        const parsed = configService.parseReleaseLine('..2.3.4@2.4.2:regExp');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.filter).toBeTruthy();
        expect(parsed.from).toBe('start');
        expect(parsed.to).toBe('2.3.4');
        expect(parsed.version).toBe('2.4.2');
        expect(parsed.filter).toBe('regExp');
    })
    it('Check empty string with separators', () => {
        const parsed = configService.parseReleaseLine('..@:');
        expect(parsed.from).toBeTruthy();
        expect(parsed.to).toBeTruthy();
        expect(parsed.version).toBeTruthy();
        expect(parsed.version).toBe('patch');
        expect(parsed.from).toBe('start');
        expect(parsed.to).toBe('now');
        expect(parsed.filter).toBeFalsy();
    })
    it('Check empty string', () => {
        const parsed = configService.parseReleaseLine('..@:');
        expect(parsed.from).toBeTruthy();
        expect(parsed.from).toBe('start');
        expect(parsed.to).toBeTruthy();
        expect(parsed.to).toBe('now');
        expect(parsed.version).toBeTruthy();
        expect(parsed.version).toBe('patch');
        expect(parsed.filter).toBeFalsy();
    })
})
describe('GetLocal', () => {
    it('Successfully loading config with relative path', async () => {
        const configFixtureLoaded = await configService.getLocal(
            './tests/fixture/config.json',
            'relative'
        );
        expect(configFixtureLoaded).toBeTruthy();
        expect(configFixtureLoaded).toEqual(configFixture);
    })
    it('Successfully loading config with absolute path', async () => {
        const configFixtureLoaded = await configService.getLocal(
            path.join(process.cwd(), './tests/fixture/config.json')
        );
        expect(configFixtureLoaded).toBeTruthy();
        expect(configFixtureLoaded).toEqual(configFixture);
    })
    it('Check wrong path error', async () => {
        try {
            await configService.getLocal('/file_not_exits.json');
        } catch (err) {
            expect(err.code).toBe("ENOENT");
        }
    })
})
describe('GetRemote', () => {
    beforeEach(() => {githubService.getContentMock.mockClear()});

    it('Check loading is started and successfully parsed', async () => {
        const result = await configService.getRemote(
            'adobe/adobe-changelog-generator:master',
            '/.github/changelog.json'
        );

        expect(result).toStrictEqual(githubService.getContentMockResult);
        expect(githubService.getContentMock).toHaveBeenCalledTimes(1);
    })
})

const ChangelogGenerationTermsParser = require('../../src/services/changelog-generation-terms-parser');
const changelogGenerationTermsParser = new ChangelogGenerationTermsParser();

describe('ParseChangelogGenerationTerms', () => {
    it('Check successful with all param passed', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1@2.4.2:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without filter', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1@2.4.2');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeFalsy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.version).toBe('2.4.2');
    })
    it('Check successful without filter with ":" separator', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1@2.4.2:');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeFalsy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.version).toBe('2.4.2');
    })
    it('Check successful without version', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.version).toBe('patch');
        expect(actual.to).toBe('2.4.1');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without version with "@" separator', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1@:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.version).toBe('patch');
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without version and filter', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeFalsy();
        expect(actual.version).toBe('patch');
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
    })
    it('Check successful without version and filter with separators', () => {
        const actual = configService.parseReleaseLine('2.3.4..2.4.1@:');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeFalsy();
        expect(actual.version).toBe('patch');
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
    })
    it('Check successful without "to" with separator', () => {
        const actual = configService.parseReleaseLine('2.3.4..@2.4.2:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('now');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without "to"', () => {
        const actual = configService.parseReleaseLine('2.3.4@2.4.2:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('now');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without "from"', () => {
        const actual = configService.parseReleaseLine('..2.3.4@2.4.2:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('start');
        expect(actual.to).toBe('2.3.4');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check empty string with separators', () => {
        const actual = configService.parseReleaseLine('..@:');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.version).toBe('patch');
        expect(actual.from).toBe('start');
        expect(actual.to).toBe('now');
        expect(actual.filter).toBeFalsy();
    })
    it('Check empty string', () => {
        const actual = configService.parseReleaseLine('..@:');
        expect(actual.from).toBeTruthy();
        expect(actual.from).toBe('start');
        expect(actual.to).toBeTruthy();
        expect(actual.to).toBe('now');
        expect(actual.version).toBeTruthy();
        expect(actual.version).toBe('patch');
        expect(actual.filter).toBeFalsy();
    })
})

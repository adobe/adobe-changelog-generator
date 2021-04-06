const ChangelogGenerationTermsParser = require('../../src/services/changelog-generation-terms-parser');
const changelogGenerationTermsParser = new ChangelogGenerationTermsParser();

describe('ParseChangelogGenerationTerms', () => {
    it('Check successful with all param passed', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1@2.4.2:regExp');
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
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1@2.4.2');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeFalsy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.version).toBe('2.4.2');
    })
    it('Check successful without filter with ":" separator', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1@2.4.2:');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeFalsy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.version).toBe('2.4.2');
    })
    it('Check successful without version', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeFalsy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without version with "@" separator', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1@:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeFalsy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without version and filter', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeFalsy();
        expect(actual.filter).toBeFalsy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
    })
    it('Check successful without version and filter with separators', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..2.4.1@:');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeFalsy();
        expect(actual.filter).toBeFalsy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.to).toBe('2.4.1');
    })
    it('Check successful without "to" with separator', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4..@2.4.2:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeFalsy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without "to"', () => {
        const actual = changelogGenerationTermsParser.parse('2.3.4@2.4.2:regExp');
        expect(actual.from).toBeTruthy();
        expect(actual.to).toBeFalsy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.from).toBe('2.3.4');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check successful without "from"', () => {
        const actual = changelogGenerationTermsParser.parse('..2.3.4@2.4.2:regExp');
        expect(actual.from).toBeFalsy();
        expect(actual.to).toBeTruthy();
        expect(actual.version).toBeTruthy();
        expect(actual.filter).toBeTruthy();
        expect(actual.to).toBe('2.3.4');
        expect(actual.version).toBe('2.4.2');
        expect(actual.filter).toBe('regExp');
    })
    it('Check empty string with separators', () => {
        const actual = changelogGenerationTermsParser.parse('..@:');
        expect(actual.from).toBeFalsy();
        expect(actual.to).toBeFalsy();
        expect(actual.version).toBeFalsy();
        expect(actual.filter).toBeFalsy();
    })
    it('Check empty string', () => {
        const actual = changelogGenerationTermsParser.parse('..@:');
        expect(actual.from).toBeFalsy();
        expect(actual.to).toBeFalsy();
        expect(actual.version).toBeFalsy();
        expect(actual.filter).toBeFalsy();
    })
})

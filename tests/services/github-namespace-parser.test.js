const GithubNamespaceParser = require('../../src/services/github-namespace-parser');
const githubNamespaceParser = new GithubNamespaceParser();

describe('ParseGithubNamespace', () => {
    it('Check successful result', () => {
        const actual = githubNamespaceParser.parse('adobe/adobe-changelog-generator:master');
        expect(actual.organization).toBeTruthy();
        expect(actual.repository).toBeTruthy();
        expect(actual.branch).toBeTruthy();
        expect(actual.organization).toBe('adobe');
        expect(actual.repository).toBe('adobe-changelog-generator');
        expect(actual.branch).toBe('master');
    });
    it('Check missing branch error', () => {
        expect(() => githubNamespaceParser.parse('adobe/adobe-changelog-generator')).toThrow();
    });
    it('Check missing branch error with separator', () => {
        expect(() => githubNamespaceParser.parse('adobe/adobe-changelog-generator:')).toThrow();
    });
    it('Check missing organization error', () => {
        expect(() => githubNamespaceParser.parse('adobe-changelog-generator:master')).toThrow();
    });
    it('Check missing organization with separator error', () => {
        expect(() => githubNamespaceParser.parse('/adobe-changelog-generator:master')).toThrow();
    });
    it('Check missing repository with separator error', () => {
        expect(() => githubNamespaceParser.parse('adobe/:master')).toThrow();
    });
});

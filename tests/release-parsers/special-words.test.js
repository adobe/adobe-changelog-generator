const SpecialWordsParser = require('../../src/release-parsers/special-words');
const githubMock = require('../mocks/github-service');
const specialWordsParser = new SpecialWordsParser(githubMock.githubServiceMock);

describe('GetRegExp', () => {
    it('Check successfully matched simple ISO-8601 date', async () => {
        expect('now'.match(specialWordsParser.getRegExp())).toBeTruthy()
    });
    it('Check successfully matched simple ISO-8601 with minutes and seconds', async () => {
        expect('current'.match(specialWordsParser.getRegExp())).toBeTruthy()
    });
    it('Check matching with wrong month', async () => {
        expect('start'.match(specialWordsParser.getRegExp())).toBeTruthy()
    });
    it('Check matching with wrong day', async () => {
        expect('2021-03-44T15:11:59+0000'.match(specialWordsParser.getRegExp())).toBeFalsy()
    });
});

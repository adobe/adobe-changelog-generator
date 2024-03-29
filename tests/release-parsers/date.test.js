const DateParser = require('../../src/release-parsers/date');
const githubMock = require('../mocks/github-service');
const dateParser = new DateParser(githubMock.githubServiceMock);

describe('GetRegExp', () => {
    it('Check successfully matched simple ISO-8601 date', async () => {
        expect('2020-01-18'.match(dateParser.getRegExp())).toBeTruthy()
    });
    it('Check successfully matched simple ISO-8601 with minutes and seconds', async () => {
        expect('2021-03-21T15:11:59+0000'.match(dateParser.getRegExp())).toBeTruthy()
    });
    it('Check matching with wrong month', async () => {
        expect('2021-14-21T15:11:59+0000'.match(dateParser.getRegExp())).toBeFalsy()
    });
    it('Check matching with wrong day', async () => {
        expect('2021-03-44T15:11:59+0000'.match(dateParser.getRegExp())).toBeFalsy()
    });
});

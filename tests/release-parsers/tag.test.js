const TagParser = require('../../src/release-parsers/tag');
const githubMock = require('../mocks/github-service');
const tagParser = new TagParser(githubMock.githubServiceMock);

describe('GetRegExp', () => {
    it('Check tag is successfully matched', async () => {
        expect('2.4.1-develop'.match(tagParser.getRegExp())).toBeTruthy()
    });
    it('Check matching with wrong tag', async () => {
        expect('2.4 version'.match(tagParser.getRegExp())).toBeFalsy()
    })
})

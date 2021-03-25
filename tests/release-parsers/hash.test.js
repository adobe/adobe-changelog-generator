const HashParser = require('../../src/release-parsers/hash');
const githubMock = require('../mocks/github-service');
const hashParser = new HashParser(githubMock.githubServiceMock);

describe('GetRegExp', () => {
    it('Check hash is successfully matched', async () => {
        expect('0fbda12fcd8bd29dc17a11f08ae506a876130035'.match(hashParser.getRegExp())).toBeTruthy()
    });
    it('Check matching with wrong hash', async () => {
        expect('0fbda12fcd8bd29dc17a11f08ae506a87613003'.match(hashParser.getRegExp())).toBeFalsy()
    })
})

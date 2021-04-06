const getContentMockResult = {
    'adobe-changelog-generator': true
};

const getContentMock = jest.fn(() => {
    return Promise.resolve({
        data: {content: Buffer.from(JSON.stringify(getContentMockResult)).toString('base64')}
    })
});

const getAllTagsMock = jest.fn(() => {
    return Promise.resolve({
        '1.0.0': {
            from: new Date('2020/02/24'),
            to: new Date('2020/03/28')
        },
        '1.0.1': {
            from: new Date('2020/03/28'),
            to: new Date('2020/05/15')
        },
        '1.0.2': {
            from: new Date('2020/05/15'),
            to: new Date('2020/10/18')
        },
        '1.0.3': {
            from: new Date('2020/10/18'),
            to: new Date('2021/02/12')
        },
        '1.0.4': {
            from: new Date('2021/02/12'),
            to: new Date('2021-03-19T05:00:00.000Z')
        }
    })
})

const githubServiceMock = {
    getAllTags: getAllTagsMock,
    getRestClient: jest.fn(() => ({
        repos: {
            getContent: getContentMock
        }
    }))
}

module.exports = {
    getContentMockResult,
    getContentMock,
    githubServiceMock,
    getAllTagsMock
}

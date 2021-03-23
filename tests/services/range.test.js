const RangeService = require('../../src/services/range');
const githubService = require('../mocks/github-service');
const DynamicFilesLoader = require('../../src/services/dynamic-files-loader');
const dynamicFilesLoaderMock = require('../mocks/dynamic-files-loader');
jest.mock('../../src/services/dynamic-files-loader', () => jest.fn());
DynamicFilesLoader.mockImplementation(() => ({getAll: dynamicFilesLoaderMock.getAllMock}));
const rangeService = new RangeService(githubService.githubServiceMock);

describe('GetParsers', () => {
    beforeEach(() => {
        DynamicFilesLoader.mockClear();
        dynamicFilesLoaderMock.getAllMock.mockClear();
    });

    it('Check successful result', async () => {
        const parsers = await rangeService.getParsers();
        expect(dynamicFilesLoaderMock.getAllMock).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getSortOrderFirst).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getSortOrderSecond).toHaveBeenCalledTimes(1);
        expect(parsers).toEqual([dynamicFilesLoaderMock.parserFirst, dynamicFilesLoaderMock.parserSecond]);
    })
})

describe('GetByPoint', () => {
    beforeEach(() => {
        DynamicFilesLoader.mockClear();
        dynamicFilesLoaderMock.getRegExpFirst.mockClear();
        dynamicFilesLoaderMock.getRegExpSecond.mockClear();
        dynamicFilesLoaderMock.getDateFirst.mockClear();
        dynamicFilesLoaderMock.getDateSecond.mockClear();
    });

    beforeAll(() => {
        rangeService.getParsers = jest.fn(() => [
            dynamicFilesLoaderMock.parserFirst,
            dynamicFilesLoaderMock.parserSecond
        ]);
    })

    it('Check first Parser correct match', async () => {
        const date = await rangeService.getByPoint('testFirst', 'adobe', 'changelog-generator');
        expect(dynamicFilesLoaderMock.getRegExpFirst).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getRegExpSecond).toHaveBeenCalledTimes(0);
        expect(dynamicFilesLoaderMock.getDateFirst).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getDateSecond).toHaveBeenCalledTimes(0);
        expect(date.getTime()).toBe((new Date('2021/03/20')).getTime())

    });

    it('Check second Parser correct match', async () => {
        const date = await rangeService.getByPoint('testSecond', 'adobe', 'changelog-generator');
        expect(dynamicFilesLoaderMock.getRegExpFirst).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getRegExpSecond).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getDateFirst).toHaveBeenCalledTimes(0);
        expect(dynamicFilesLoaderMock.getDateSecond).toHaveBeenCalledTimes(1);
        expect(date.getTime()).toBe((new Date('2021/03/21')).getTime())

    })

    it('Check parsers does not match', async () => {
        const date = await rangeService.getByPoint('testThird', 'adobe', 'changelog-generator');
        expect(dynamicFilesLoaderMock.getRegExpFirst).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getRegExpSecond).toHaveBeenCalledTimes(1);
        expect(dynamicFilesLoaderMock.getDateFirst).toHaveBeenCalledTimes(0);
        expect(dynamicFilesLoaderMock.getDateSecond).toHaveBeenCalledTimes(0);
        expect(date).toBeFalsy()
    })
})

describe('GetRange', () => {
    beforeAll(() => {
        rangeService.getByPoint = jest.fn(() => new Date('2020/03/20'));
    })

    it('Check successful result', async () => {
        const date = await rangeService.getRange('adobe', 'changelog-generator', '2.4.1', '2.5.1');
        expect(rangeService.getByPoint).toHaveBeenCalledTimes(2);
        expect(date).toStrictEqual({
            from: new Date('2020/03/20'),
            to: new Date('2020/03/20')
        });
    });
});

describe('GetVersions', () => {
    beforeEach(() => {
       githubService.getAllTagsMock.mockClear()
    });

    it('Check successful result with all range of release lines', async () => {
        const versions = await rangeService.getVersions(
            'adobe',
            'changelog-generator',
            new Date('2020/03/20'),
            new Date('2021/03/21'),
            null,
            '1.0.9'
        );

        expect(githubService.getAllTagsMock).toHaveBeenCalledTimes(1);
        expect(versions).toStrictEqual({
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
                to: new Date('2021/03/19')
            },
            '1.0.9': {
                from: new Date('2021/03/19'),
                to: new Date('2021/03/21')
            }
        })
    });
    it('Check successful result without from part of releases ', async () => {
        const versions = await rangeService.getVersions(
            'adobe',
            'changelog-generator',
            new Date('2020/03/29'),
            new Date('2021/03/21'),
            null,
            '1.0.9'
        );

        expect(githubService.getAllTagsMock).toHaveBeenCalledTimes(1);
        expect(versions).toStrictEqual({
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
                to: new Date('2021/03/19')
            },
            '1.0.9': {
                from: new Date('2021/03/19'),
                to: new Date('2021/03/21')
            }
        })
    });
    it('Check successful result without from to of releases ', async () => {
        const versions = await rangeService.getVersions(
            'adobe',
            'changelog-generator',
            new Date('2020/03/29'),
            new Date('2021/03/18'),
            null,
            '1.0.9'
        );

        expect(githubService.getAllTagsMock).toHaveBeenCalledTimes(1);
        expect(versions).toStrictEqual({
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
                to: new Date('2021/03/19')
            }
        })
    });
    it('Check successful result in release ', async () => {
        const versions = await rangeService.getVersions(
            'adobe',
            'changelog-generator',
            new Date('2020/10/19'),
            new Date('2021/02/11'),
            null,
            '1.0.9'
        );

        expect(githubService.getAllTagsMock).toHaveBeenCalledTimes(1);
        expect(versions).toStrictEqual({
            '1.0.3': {
                from: new Date('2020/10/18'),
                to: new Date('2021/02/12')
            }
        })
    });
    it('Check filter ', async () => {
        const versions = await rangeService.getVersions(
            'adobe',
            'changelog-generator',
            new Date('2020/05/16'),
            new Date('2021/02/11'),
            '1.0.2',
            '1.0.9'
        );

        expect(githubService.getAllTagsMock).toHaveBeenCalledTimes(1);
        expect(versions).toStrictEqual({
            '1.0.3': {
                from: new Date('2020/10/18'),
                to: new Date('2021/02/12')
            }
        })
    });
});

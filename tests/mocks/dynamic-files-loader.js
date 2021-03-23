const getSortOrderFirst = jest.fn(() => 1);
const getSortOrderSecond = jest.fn(() => 2);
const getRegExpFirst = jest.fn(() => 'testFirst');
const getRegExpSecond = jest.fn(() => 'testSecond');
const getDateFirst = jest.fn(() => new Date('2021/03/20'));
const getDateSecond = jest.fn(() => new Date('2021/03/21'));
const parserFirst = jest.fn(() => ({
    getSortOrder: getSortOrderFirst,
    getRegExp: getRegExpFirst,
    getDate: getDateFirst
}));
const parserSecond = jest.fn(() => ({
    getSortOrder: getSortOrderSecond,
    getRegExp: getRegExpSecond,
    getDate: getDateSecond
}));
const getAllMock = jest.fn(() => ({parserSecond, parserFirst }));

module.exports = {
    getAllMock,
    getSortOrderFirst,
    getSortOrderSecond,
    parserFirst,
    parserSecond,
    getRegExpFirst,
    getRegExpSecond,
    getDateFirst,
    getDateSecond
}

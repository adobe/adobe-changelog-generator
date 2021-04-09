const getSortOrderFirst = jest.fn(() => 1);
const getSortOrderSecond = jest.fn(() => 2);
const getRegExpFirst = jest.fn(() => 'testFirst');
const getRegExpSecond = jest.fn(() => 'testSecond');
const getFromSecond = jest.fn(() => new Date('2021/03/18'));
const getFromFirst = jest.fn(() => new Date('2021/03/20'));
const getToFirst = jest.fn(() => new Date('2021/03/21'));
const getToSecond = jest.fn(() => new Date('2021/03/19'));
const parserFirst = jest.fn(() => ({
    getSortOrder: getSortOrderFirst,
    getRegExp: getRegExpFirst,
    getFromDate: getFromFirst,
    getToDate: getToFirst
}));
const parserSecond = jest.fn(() => ({
    getSortOrder: getSortOrderSecond,
    getRegExp: getRegExpSecond,
    getFromDate: getFromSecond,
    getToDate: getToSecond
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
    getFromFirst,
    getFromSecond,
    getToFirst,
    getToSecond
}

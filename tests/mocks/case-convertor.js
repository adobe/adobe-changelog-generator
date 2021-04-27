const convertPascalToUnderscore = jest.fn(() => ('pascal_to_underscore'));
const convertPascalToDash = jest.fn(() => ('pascal-to-dash'));

module.exports = {
    convertPascalToDash,
    convertPascalToUnderscore
}

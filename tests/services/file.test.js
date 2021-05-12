const configFixture = require('../fixture/config.json');
const fileService = require('../../src/services/file');
const path = require('path');
const fs = require('fs');

describe('Load', () => {
    it('Successfully loading JSON file with relative path', async () => {
        const configFixtureLoaded = fileService.loadJSON(
            './tests/fixture/config.json',
            'relative'
        );
        expect(configFixtureLoaded).toBeTruthy();
        expect(configFixtureLoaded).toEqual(configFixture);
    })
    it('Successfully loading JSON file with absolute path', async () => {
        const configFixtureLoaded = fileService.loadJSON(
            path.join(process.cwd(), './tests/fixture/config.json')
        );
        expect(configFixtureLoaded).toBeTruthy();
        expect(configFixtureLoaded).toEqual(configFixture);
    })
    it('Check wrong path error', async () => {
        try {
            fileService.load('/file_not_exits.json');
        } catch (err) {
            expect(err.code).toBe("ENOENT");
        }
    })
})
describe('Create', () => {
    it('Successfully create file', async () => {
        const configFixtureLoaded = fileService.loadJSON(
            './tests/fixture/config.json',
            'relative'
        );
        const filePath = path.join(process.cwd(), './tests/fixture/test.json');
        const data = JSON.stringify({repository: 'changelog-generator'});
        fileService.create(filePath, data, () => {
                const file = fs.readFileSync(filePath)
                expect(file).toBeTruthy();
                expect(JSON.stringify(JSON.parse(file))).toBe(data);
                fs.unlinkSync(filePath);
            }
        );
    })
})

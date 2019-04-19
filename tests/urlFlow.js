const removd = require('../removd');
const path = require('path');
const expect = require('chai').expect;
const record = require('./record');

const testFileSource = 'https://images.unsplash.com/';
const testFileName = 'photo-1504455583697';
const testFile_LQ = testFileSource + testFileName + '-3a9b04be6397?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80';
const dir = path.resolve(__dirname, `../assets/`);

describe('# url workflow', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('without paremeters', () => {
        it('should return missing paremeters error', async () => {
            const done = await removd.url();
            expect(done).to.deep.equal({
                error: 'Missing paremeters'
            });
        });
    });

    context('without source', () => {
        it('should return missing source url error', async () => {
            const done = await removd.url({});
            expect(done).to.deep.equal({
                error: 'Missing source url'
            });
        });
    });

    context('with incorrect source', () => {
        it('should return invalid url error', async () => {
            const done = await removd.url({
                source: dir
            });
            expect(done).to.deep.equal({
                error: 'Invalid URL: ' + dir
            });
        });
    });

    context('with correct source but without destination', () => {
        it('should return requirement for final destination', async () => {
            const done = await removd.url({
                source: testFile_LQ
            });
            expect(done).to.deep.equal({
                error: 'Destination required'
            });
        });
    });

    context('with correct source and incorrect size', () => {
        it('should return unsupported size error', async () => {
            const done = await removd.url({
                size: 'UHD',
                destination: `${dir}/`,
                source: testFile_LQ
            });

            expect(done).to.deep.equal({
                error: 'Unsupported size type'
            });
        });
    });

    context('with correct source and detect type', () => {
        it('should return unsupported detect type error', async () => {
            const done = await removd.url({
                detect: 'ufo',
                destination: `${dir}/`,
                source: testFile_LQ
            });

            expect(done).to.deep.equal({
                error: 'Unsupported detect type'
            });
        });
    });

    context('with correct source and incorrect channels type', () => {
        it('should return unsupported channels type error', async () => {
            const done = await removd.url({
                channels: 'red',
                destination: `${dir}/`,
                source: testFile_LQ
            });

            expect(done).to.deep.equal({
                error: 'Unsupported channels type'
            });
        });
    });

    context('with correct source and incorrect format type', () => {
        it('should return unsupported format type error', async () => {
            const done = await removd.url({
                format: 'bmp',
                destination: `${dir}/`,
                source: testFile_LQ
            });

            expect(done).to.deep.equal({
                error: 'Unsupported format type'
            });
        });
    });

    context('with correct source and incorrect hex background code', () => {
        it('should return unsupported background type error', async () => {
            const done = await removd.url({
                background: '?31]',
                destination: `${dir}/`,
                source: testFile_LQ
            });

            expect(done).to.deep.equal({
                error: 'Expected a valid hex string'
            });
        });
    });

    context('with correct source and incorrect rgba background color', () => {
        it('should return unsupported background type error', async () => {
            const done = await removd.url({
                background: 'rgba(123, 213, 123, 90)',
                destination: `${dir}/`,
                source: testFile_LQ
            });

            expect(done).to.deep.equal({
                error: 'Expected alpha value (90) as a fraction or percentage'
            });
        });
    });

    context('with incorrect url in source and with destination', () => {
        it('should return unsupported file format error', async () => {
            const done = await removd.url({
                destination: `${dir}/`,
                source: testFileSource
            });

            expect(done).to.deep.equal({
                error: 'Unsupported file format',
                source: testFileSource
            });
        });
    });

    context('with missing image in source and with destination', () => {
        it('should return request failed error', async () => {

            const done = await removd.url({
                destination: `${dir}/`,
                source: testFileSource + testFileName
            });

            expect(done).to.deep.equal({
                error: 'Not Found',
                source: testFileSource + testFileName
            });

        });
    });

    context('with batch source but incorrect url', () => {
        it('should return invalid file type error and failed to download error', async () => {

            const done = await removd.url({
                destination: `${dir}/`,
                source: [
                    testFileSource,
                    testFileSource + testFileName
                ]
            });

            expect(done).to.be.an('array').to.have.deep.members(([{
                error: "Unsupported file format",
                source: testFileSource
            }, {
                error: "Not Found",
                source: testFileSource + testFileName
            }]));

        });
    });

    after(recorder.after);

});
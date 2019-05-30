const path = require('path');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');

const testFile_LQ = 'default/christopher-campbell-28567-unsplash-400x267';
const dir = path.resolve(__dirname, '../assets/');

describe('# file workflow', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('without paremeters', () => {
        it('should return missing paremeters error', async () => {
            const done = await removd.file();
            expect(done).to.deep.equal({
                error: 'Missing paremeters'
            });
        });
    });

    context('without source', () => {
        it('should return missing source file error', async () => {
            const done = await removd.file({});
            expect(done).to.deep.equal({
                error: 'Missing source file'
            });
        });
    });

    context('with incorrect source', () => {
        it('should return not a valid file', async () => {
            const done = await removd.file({
                source: `${dir}/`
            });
            expect(done).to.deep.equal({
                error: 'Not a valid file',
                source: `${dir}/`
            });
        });
    });

    context('with correct source but incorrect file type', () => {
        it('should return unsupported file format error', async () => {
            const done = await removd.file({
                source: `${dir}/${testFile_LQ}.bmp`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported file format',
                source: `${dir}/${testFile_LQ}.bmp`
            });
        });
    });

    context('with correct source but incorrect size', () => {
        it('should return unsupported size format error', async () => {
            const done = await removd.file({
                size: 'UHD',
                source: `${dir}/${testFile_LQ}.jpg`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported size type'
            });
        });
    });

    context('with correct source but incorrect detect type', () => {
        it('should return unsupported detect type error', async () => {
            const done = await removd.file({
                detect: 'ufo',
                source: `${dir}/${testFile_LQ}.jpg`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported detect type'
            });
        });
    });

    context('with correct source but incorrect channels type', () => {
        it('should return unsupported channels type error', async () => {
            const done = await removd.file({
                channels: 'random',
                source: `${dir}/${testFile_LQ}.jpg`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported channels type'
            });
        });
    });

    context('with correct source but incorrect format type', () => {
        it('should return unsupported format type error', async () => {
            const done = await removd.file({
                format: 'bmp',
                source: `${dir}/${testFile_LQ}.jpg`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported format type'
            });
        });
    });

    context('with correct source but incorrect hex background code', () => {
        it('should return unsupported background type error', async () => {
            const done = await removd.file({
                background: '?31]',
                source: `${dir}/${testFile_LQ}.jpg`
            });
            expect(done).to.deep.equal({
                error: 'Expected a valid hex string'
            });
        });
    });

    context('with correct source but incorrect rgba background color', () => {
        it('should return unsupported background type error', async () => {
            const done = await removd.file({
                background: 'rgba(123, 213, 123, 90)',
                source: `${dir}/${testFile_LQ}.jpg`
            });
            expect(done).to.deep.equal({
                error: 'Expected alpha value (90) as a fraction or percentage'
            });
        });
    });

    context('with batch source but unsupported file type and with unsupported file', () => {
        it('should return unsupported file format error and not a valid file error', async () => {

            const item1 = `${dir}/${testFile_LQ}.bmp`;
            const item2 = `${dir}/${testFile_LQ}.tiff`;
            const item3 = `${dir}/${testFile_LQ}.txt`;

            const done = await removd.file({
                source: [
                    item1,
                    item2,
                    item3
                ]
            });

            expect(done).to.be.an('array').to.have.deep.members(([{
                error: "Unsupported file format",
                source: item1
            }, {
                error: "Not a valid file",
                source: item2
            }, {
                error: "Unsupported file format",
                source: item3
            }]));

        });
    });

    context('with batch glob source but unsupported file format', () => {
        it('should return unsupported file format error', async () => {

            const item1 = `${dir}/default/*.bmp`;
            const item2 = `${dir}/default/*.txt`;

            const done = await removd.file({
                glob: true,
                source: [
                    item1,
                    item2
                ]
            });

            expect(done).to.be.an('array').to.have.deep.members(([{
                error: "Unsupported file format",
                source: `${dir}/default/christopher-campbell-28567-unsplash-400x267.bmp`
            }, {
                error: "Unsupported file format",
                source: `${dir}/default/christopher-campbell-28567-unsplash-400x267.txt`
            }, {
                error: "Unsupported file format",
                source: `${dir}/default/christopher-campbell-28567-unsplash-2400x1600.txt`
            }, {
                error: "Unsupported file format",
                source: `${dir}/default/christopher-campbell-28567-unsplash-3750x2500.txt`
            }, {
                error: "Unsupported file format",
                source: `${dir}/default/christopher-campbell-28567-unsplash-400x267-url.txt`
            }, {
                error: "Unsupported file format",
                source: `${dir}/default/christopher-campbell-28567-unsplash-1500x1000.txt`
            }]));

        });
    });

    after(recorder.after);

});
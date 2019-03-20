const path = require('path');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');

const testFile_LQ = 'christopher-campbell-28567-unsplash-400x267';
const dir = path.resolve(__dirname, '../assets/');

describe('# base64 workflow', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('without paremeters', () => {
        it('should return missing paremeters error', async () => {
            const done = await removd.base64();
            expect(done).to.deep.equal({
                error: 'Missing paremeters'
            });
        });
    });

    context('without source', () => {
        it('should return missing source file error', async () => {
            const done = await removd.base64({});
            expect(done).to.deep.equal({
                error: 'Missing source file'
            });
        });
    });

    context('with incorrect source', () => {
        it('should return not a valid file error', async () => {
            const done = await removd.base64({
                source: `${dir}/`
            });
            expect(done).to.deep.equal({
                error: 'Not a valid file',
                source: `${dir}/`
            });
        });
    });

    context('with correct source but unsupported file type', () => {
        it('should return unsupported file format error', async () => {
            const done = await removd.base64({
                source: `${dir}/${testFile_LQ}.bmp`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported file format',
                source: `${dir}/${testFile_LQ}.bmp`
            });
        });
    });

    context('with correct source but unsupported size', () => {
        it('should return unsupported size error', async () => {
            const done = await removd.base64({
                size: 'UHD',
                source: `${dir}/${testFile_LQ}.txt`
            });
            expect(done).to.deep.equal({
                error: 'Unsupported size'
            });
        });
    });

    context('with batch source but unsupported file type and with unsupported file', () => {
        it('should return unsupported file format error and not a valid file error', async () => {

            const item1 = `${dir}/${testFile_LQ}-testFile.jpg`;
            const item2 = `${dir}/${testFile_LQ}.bmp`;

            const done = await removd.base64({
                source: [
                    item1,
                    item2
                ]
            });

            expect(done).to.be.an('array').to.have.deep.members(([{
                error: "Not a valid file",
                source: item1,
            }, {
                error: "Unsupported file format",
                source: item2
            }]));

        });
    });

    context('with batch glob source but unsupported file format', () => {
        it('should return unsupported file format error', async () => {

            const item1 = `${dir}/*.bmp`;

            const done = await removd.base64({
                glob: true,
                source: [
                    item1
                ]
            });

            expect(done).to.be.an('array').to.have.deep.members(([{
                error: "Unsupported file format",
                source: `${dir}/christopher-campbell-28567-unsplash-400x267.bmp`
            }]));

        });
    });

    after(recorder.after);

});
const path = require('path');
const expect = require('chai').expect;
const del = require('del');
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const testFile = 'https://images.unsplash.com/photo-1504455583697-3a9b04be6397?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=';
const testFile_5k = `${testFile}5184&q=80`;
const dir = path.resolve(__dirname, `../assets/`);

describe('# url preserve workflow service API', () => {

    const recorder = record(path.parse(__filename).name);
    before(recorder.before);

    context('with correct source and destination a 5k image with person', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                destination: dir,
                source: testFile_5k
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const url = new URL(testFile_5k);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should be resized', () => {
            expect(outcome.resized).to.be.true;
        });

        it('outcome should be 4k and charged 8 credits', () => {
            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '3873x2582',
                detected: 'person',
                preserved: false,
                size: '4k'
            });

        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should match', () => {
            expect(`${sourceFile.name}`).to.equal(`${destinationFile.name}`);
        });

        it('saved 4k image should be 3873x2582', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 3873,
                height: 2582
            });
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a 5k image with person but resolution preserved', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                preserve: true,
                destination: dir,
                source: testFile_5k
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const url = new URL(testFile_5k);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should be resized', () => {
            expect(outcome.resized).to.be.true;
        });

        it('outcome should be 4k and charged 8 credits', () => {
            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '5184x3456',
                detected: 'person',
                preserved: true,
                size: '4k'
            });

        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should match', () => {
            expect(`${sourceFile.name}`).to.equal(`${destinationFile.name}`);
        });

        it('saved 5k image should be 5184x3456', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 5184,
                height: 3456
            });
            await del([`${dir}/*.png`]);
        });

    });

    after(recorder.after);

});
const fs = require('fs');
const util = require('util');
const path = require('path');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const mainName = 'christopher-campbell-28567-unsplash';
const testFile_5K = `${mainName}-5184x3456`;
const dir = path.resolve(__dirname, '../assets/');

const unlink = util.promisify(fs.unlink);

describe('# file preserve workflow service API', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('with correct source, same destination a 5k image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/ultrahd/${testFile_5K}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            sourceFile = path.parse(testFile);
            destinationFile = path.parse(outcome.destination);

        });

        it('should preserve original source file', async () => {
            const originalSource = await common.currentFile(testFile);
            expect(originalSource).to.deep.equal({
                exists: true,
                source: testFile
            });
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
                preserved: false,
                detected: 'person',
                size: '4k'
            });

        });

        it('destination file should be resized', () => {
            expect(outcome.resized).to.be.true;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(outcome.destination)).to.equal(path.dirname(testFile));
        });

        it('should save new image in source\'s original directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should match', () => {
            expect(sourceFile.dir + `/${sourceFile.name}`).to.equal(destinationFile.dir + `/${destinationFile.name}`);
        });

        it('source and destinaton extensions should not match', () => {
            expect(sourceFile.ext).to.equal('.jpg');
            expect(destinationFile.ext).to.equal('.png');
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
            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a 5k image with person and size auto detected but resolution preserved', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/ultrahd/${testFile_5K}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                preserve: true,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            sourceFile = path.parse(testFile);
            destinationFile = path.parse(outcome.destination);

        });

        it('should preserve original source file', async () => {
            const originalSource = await common.currentFile(testFile);
            expect(originalSource).to.deep.equal({
                exists: true,
                source: testFile
            });
        });

        it('outcome should be 5k and charged 8 credits', () => {
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
                preserved: true,
                detected: 'person',
                size: '4k'
            });

        });

        it('destination file should be resized', () => {
            expect(outcome.resized).to.be.true;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(outcome.destination)).to.equal(path.dirname(testFile));
        });

        it('should save new image in source\'s original directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should match', () => {
            expect(sourceFile.dir + `/${sourceFile.name}`).to.equal(destinationFile.dir + `/${destinationFile.name}`);
        });

        it('source and destinaton extensions should not match', () => {
            expect(sourceFile.ext).to.equal('.jpg');
            expect(destinationFile.ext).to.equal('.png');
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
            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a 5k image with person and size auto detected and alpha channels set but resolution preserved', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/ultrahd/${testFile_5K}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                preserve: true,
                channels: 'alpha',
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            sourceFile = path.parse(testFile);
            destinationFile = path.parse(outcome.destination);

        });

        it('should preserve original source file', async () => {
            const originalSource = await common.currentFile(testFile);
            expect(originalSource).to.deep.equal({
                exists: true,
                source: testFile
            });
        });

        it('outcome should be 5k and charged 8 credits', () => {
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
                preserved: true,
                detected: 'person',
                size: '4k'
            });

        });

        it('destination file should be resized', () => {
            expect(outcome.resized).to.be.true;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(outcome.destination)).to.equal(path.dirname(testFile));
        });

        it('should save new image in source\'s original directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names not should match', () => {
            expect(sourceFile.dir + `/${sourceFile.name}`).to.equal(destinationFile.dir + `/${destinationFile.name}`);
        });

        it('source and destinaton extensions should not match', () => {
            expect(sourceFile.ext).to.equal('.jpg');
            expect(destinationFile.ext).to.equal('.jpeg');
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
            await unlink(outcome.destination);
        });

    });

    after(recorder.after);

});
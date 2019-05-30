const fs = require('fs');
const path = require('path');
const util = require('util');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const unlink = util.promisify(fs.unlink);

const mainName = 'christopher-campbell-28567-unsplash';
const testFile_5K = `ultrahd/${mainName}-5184x3456`;
const dir = path.resolve(__dirname, `../assets/`);

describe('# base64 preserve workflow service API', () => {

    const recorder = record(path.parse(__filename).name);
    before(recorder.before);

    context('with text source, same destination a 5k image and size with person autodetected and saved as image and resolution preserved', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_5K}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                toImage: true,
                preserve: true,
                detect: 'person',
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
                detected: 'person',
                preserved: true,
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
            expect(sourceFile.ext).to.equal('.txt');
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

    context('with text source, same destination a 5k image and size autodetected, format set with person and resolution preserved', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_5K}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                format: 'png',
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
                detected: 'person',
                preserved: true,
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

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = destinationFile.name.split('-');
            const id = deconstructed.pop();
            expect(sourceFile.dir + `/${sourceFile.name}`).to.equal(destinationFile.dir + `/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('source and destinaton extensions should match', () => {
            expect(sourceFile.ext).to.equal(destinationFile.ext);
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

    context('with url data source, same destination a 5k image and size set with person and resolution preserved', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_5K}-url.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                size: '4k',
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
                detected: 'person',
                preserved: true,
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

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = destinationFile.name.split('-');
            const id = deconstructed.pop();
            expect(sourceFile.dir + `/${sourceFile.name}`).to.equal(destinationFile.dir + `/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('source and destinaton extensions should match', () => {
            expect(sourceFile.ext).to.equal(destinationFile.ext);
        });

        it('saved 5k image should be 5184x3456', async () => {
            const {
                dataUrl,
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                dataUrl,
                width,
                height
            }).to.deep.equal({
                dataUrl: true,
                width: 5184,
                height: 3456
            });
            await unlink(outcome.destination);
        });

    });

    after(recorder.after);

});
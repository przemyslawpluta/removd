const fs = require('fs');
const util = require('util');
const path = require('path');
const del = require('del');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const mainName = 'christopher-campbell-28567-unsplash';
const testFile_LQ = `${mainName}-400x267`;
const testFile_MQ = `${mainName}-1500x1000`;
const testFile_HQ = `${mainName}-2400x1600`;
const testFile_UHD = `${mainName}-3750x2500`;
const dir = path.resolve(__dirname, '../assets/');

const unlink = util.promisify(fs.unlink);

describe('# service API file workflow test', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('with correct source and image without persons', () => {

        it('should return no persons found error', async () => {

            await del([`${dir}/*.png`]);

            const failedOutcome = await removd.file({
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

            expect(failedOutcome).to.deep.equal({
                error: "No persons found: At the moment remove.bg only works for photos with at least one person in them. Sorry – please select an appropriate image.",
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

    });

    context('with correct source, same destination a regular image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be regular and charged 1 credit', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                size: 'regular'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('saved regular image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });

            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a regular image with person and size set to auto', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                size: 'auto',
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be regular and charged 1 credit', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('saved regular image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });

            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a regular image with person and size auto detected and destination file name bumped', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/bump/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be regular and charged 1 credit', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                size: 'regular'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('source and destinaton extensions should not match', () => {
            expect(sourceFile.ext).to.equal('.jpg');
            expect(destinationFile.ext).to.equal('.png');
        });

        it('saved regular image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
            await unlink(outcome.destination);
        });

    });

    context('with correct source, different destination a regular image with person and size auto detected and same file name in destination', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}-tag.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                destination: `${dir}/bump/`,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be regular and charged 1 credit', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                size: 'regular'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
        });

        it('source and destination paths should not match', () => {
            expect(path.dirname(outcome.destination)).to.equal(`${dir}/bump`);
        });

        it('should save new image in directory different to source', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should match', () => {
            expect(sourceFile.name).to.equal(destinationFile.name);
        });

        it('source and destinaton extensions should not match', () => {
            expect(sourceFile.ext).to.equal('.jpg');
            expect(destinationFile.ext).to.equal('.png');
        });

        it('saved regular image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
            await unlink(outcome.destination);
        });

    });

    context('with correct source, different destination a regular image with person and size auto detected and set file name in destination', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}-tag.jpg`;
        const targetName = 'my-new-test-file';

        it('should return object', async () => {

            outcome = await removd.file({
                destination: `${dir}/bump/${targetName}.jpg`,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be regular and charged 1 credit', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                size: 'regular'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
        });

        it('source and destination paths should not match', () => {
            expect(path.dirname(outcome.destination)).to.equal(`${dir}/bump`);
        });

        it('should save new image in directory different to source', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should not match', () => {
            expect(destinationFile.name).to.equal(`${targetName}`);
        });

        it('source and destinaton extensions should not match', () => {
            expect(sourceFile.ext).to.equal('.jpg');
            expect(destinationFile.ext).to.equal('.png');
        });

        it('saved regular image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination an hd image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_HQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be hd and charged 5 credits', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 5,
                dimensions: '2400x1600',
                size: 'hd'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('saved hd image should be 2400x1600', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 2400,
                height: 1600
            });
            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination an hd image with person and size forced to regular', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_HQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                size: 'regular',
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be regular and charged 1 credit', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '612x408',
                size: 'regular'
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

        it('saved regular image should be 612x408', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 612,
                height: 408
            });
            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a medium image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_MQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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

        it('outcome should be medium and charged 3 credits', () => {
            const {
                charged,
                dimensions,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 3,
                dimensions: '1500x1000',
                size: 'medium'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('saved medium image should be 1500x1000', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1500,
                height: 1000
            });
            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a 4k image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_UHD}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

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
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '3750x2500',
                size: '4k'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('saved 4k image should be 3750x2500', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 3750,
                height: 2500
            });
            await unlink(outcome.destination);
        });

    });

    after(recorder.after);

});
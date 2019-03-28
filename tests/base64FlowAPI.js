const fs = require('fs');
const path = require('path');
const util = require('util');
const del = require('del');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const unlink = util.promisify(fs.unlink);

const mainName = 'christopher-campbell-28567-unsplash';
const testFile_LQ = `${mainName}-400x267`;
const testFileProduct_LQ = `product/ruslan-bardash-351288-unsplash-267x400`;
const testFile_MQ = `${mainName}-1500x1000`;
const testFileProduct_MQ = `product/paul-gaudriault-661082-unsplash-1029x1500`;
const testFile_HQ = `${mainName}-2400x1600`;
const testFile_UHD = `${mainName}-3750x2500`;
const dir = path.resolve(__dirname, `../assets/`);

describe('# service API base64 workflow test', () => {

    const recorder = record(path.parse(__filename).name);
    before(recorder.before);

    context('with correct source and image without persons', () => {

        it('should return no persons found error', async () => {

            await del([`${dir}/*.png`]);

            const failedOutcome = await removd.base64({
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

            expect(failedOutcome).to.deep.equal({
                error: "Could not find person or product in image. For details and recommendations see https://www.remove.bg/supported-images.",
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

    });

    context('with image as source, same destination a regular image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.base64({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
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

    context('with image as source, same destination a regular image with person, size auto detected and alpha channels', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.base64({
                channels: 'alpha',
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
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

    context('with image as source, same destination a regular image with person and size set to auto and detect set', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.base64({
                size: 'auto',
                detect: 'person',
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
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

    context('with image as source, same destination a regular image with product autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.base64({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '267x400',
                detected: 'product',
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

        it('saved regular image should be 267x400', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 267,
                height: 400
            });
            await unlink(outcome.destination);
        });

    });

    context('with image as source, same destination a regular image with set product and alpha channels', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_MQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.base64({
                channels: 'alpha',
                detect: 'product',
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 5,
                dimensions: '1029x1500',
                detected: 'product',
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

        it('saved hd image should be 1029x1500', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1029,
                height: 1500
            });
            await unlink(outcome.destination);
        });

    });

    context('with text source, same destination a regular image with person and destination file name bumped', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
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

        it('source and destinaton extensions should match', async () => {
            expect(sourceFile.ext).to.equal(destinationFile.ext);
            await unlink(outcome.destination);
        });

    });

    context('with text source, same destination a regular image with person and saved as image', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                toImage: true,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
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
            expect(sourceFile.ext).to.equal('.txt');
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

    context('with url date source, same destination a regular image with person', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}-url.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
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

        it('source and destinaton extensions should match', async () => {
            expect(sourceFile.ext).to.equal(destinationFile.ext);
            await unlink(outcome.destination);
        });

    });

    context('with text source, same destination a regular image with person and set file name in destination', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.txt`;
        const targetName = 'my-new-test-file';

        it('should return object', async () => {

            outcome = await removd.base64({
                destination: `${dir}/${targetName}.txt`,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
                size: 'regular'
            });

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
        });

        it('source and destinaton file names should not match', () => {
            expect(destinationFile.name).to.equal(`${targetName}`);
        });

        it('source and destinaton extensions should match', async () => {
            expect(sourceFile.ext).to.equal(destinationFile.ext);
            await unlink(outcome.destination);
        });

    });

    context('with text source, same destination a medium image and size set with person and saved as image', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_MQ}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                size: 'medium',
                toImage: true,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 3,
                dimensions: '1500x1000',
                detected: 'person',
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
            expect(sourceFile.ext).to.equal('.txt');
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

    context('with text source, same destination an hd image and size set with person and saved as image', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_HQ}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                size: 'hd',
                toImage: true,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                detected,
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 5,
                dimensions: '2400x1600',
                detected: 'person',
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
            expect(sourceFile.ext).to.equal('.txt');
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

    context('with text source, same destination a 4k image and size set with person and saved as image', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_UHD}.txt`;

        it('should return object', async () => {

            outcome = await removd.base64({
                size: '4k',
                toImage: true,
                source: testFile
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

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
                size
            } = outcome;

            expect({
                charged,
                dimensions,
                detected,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '3750x2500',
                detected: 'person',
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
            expect(sourceFile.ext).to.equal('.txt');
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
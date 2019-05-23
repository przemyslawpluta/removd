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
const testFileProduct_LQ = `product/mnz-1214788-unsplash-400x267`;
const testFileCar_LQ = `car/hayes-potter-787785-unsplash-400x267`;
const testFile_MQ = `${mainName}-1500x1000`;
const testFileProduct_MQ = `product/paul-gaudriault-661082-unsplash-1000x1458`;
const testFileCar_MQ = `car/joey-banks-259792-unsplash-1500x1000`;
const testFile_HQ = `${mainName}-2400x1600`;
const testFile_UHD = `${mainName}-3750x2500`;
const dir = path.resolve(__dirname, '../assets/');

const unlink = util.promisify(fs.unlink);

describe('# file workflow service API', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('with correct source and image without persons', () => {

        it('should return no persons, product or car found error', async () => {

            await del([`${dir}/*.png`]);

            const failedOutcome = await removd.file({
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

            expect(failedOutcome).to.deep.equal({
                error: "Could not find person, product or car in image. For details and recommendations see https://www.remove.bg/supported-images.",
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

    });

    context('with correct source, same destination a small image with person and size auto detected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                detected: 'person',
                dimensions: '400x267',
                preserved: true,
                size: 'small'
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

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, same destination a small image with person, size auto detected and alpha channels', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                detected: 'person',
                dimensions: '400x267',
                preserved: true,
                size: 'small'
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
            expect(destinationFile.ext).to.equal('.jpeg');
        });

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, same destination a small image with person and size set to auto and detect set', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                size: 'auto',
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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '400x267',
                preserved: true,
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

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, same destination a small image with product', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_LQ}.jpg`;

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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '400x267',
                preserved: true,
                detected: 'product',
                size: 'small'
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

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, same destination a medium image with product, detect set to product and alpha channel', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_MQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                channels: 'alpha',
                detect: 'product',
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

        it('outcome should be medium and charged 3 credit', () => {
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
                charged: 3,
                dimensions: '1000x1458',
                preserved: true,
                detected: 'product',
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
            expect(destinationFile.ext).to.equal('.jpeg');
        });

        it('saved medium image should be 1000x1458', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1000,
                height: 1458
            });

            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a medium image with format set and named background color', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_MQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                format: 'jpg',
                background: 'blue',
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

        it('outcome should be hd and charged 3 credits', () => {
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
                charged: 3,
                dimensions: '1000x1458',
                preserved: true,
                detected: 'product',
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
            expect(destinationFile.ext).to.equal('.jpeg');
        });

        it('saved medium image should be 1000x1458', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1000,
                height: 1458
            });

            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a medium image with hex background and product autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_MQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                background: '81d4fa77',
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

        it('outcome should be hd and charged 3 credits', () => {
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
                charged: 3,
                dimensions: '1000x1458',
                preserved: true,
                detected: 'product',
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

        it('saved medium image should be 1000x1458', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1000,
                height: 1458
            });

            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a medium image with rgba background set and product autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileProduct_MQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                background: 'rgba(197, 127, 73, .5)',
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

        it('outcome should be hd and charged 3 credits', () => {
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
                charged: 3,
                dimensions: '1000x1458',
                preserved: true,
                detected: 'product',
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

        it('saved medium image should be 1000x1458', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1000,
                height: 1458
            });

            await unlink(outcome.destination);
        });

    });

    context('with correct source, same destination a small image with and car set', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileCar_LQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                detect: 'car',
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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '400x267',
                preserved: true,
                detected: 'car',
                size: 'small'
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

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, same destination a medium image with and car autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFileCar_MQ}.jpg`;

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

        it('outcome should be medium and charged 3 credits', () => {
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
                charged: 3,
                dimensions: '1500x1000',
                preserved: true,
                detected: 'car',
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

    context('with correct source, same destination a small image with person and size auto detected and destination file name bumped', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/bump/${testFile_LQ}.jpg`;

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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '400x267',
                preserved: true,
                detected: 'person',
                size: 'small'
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

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, different destination a small image with person and size auto detected and same file name in destination', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_LQ}-tag.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                destination: `${dir}/bump/`,
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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '400x267',
                preserved: true,
                detected: 'person',
                size: 'small'
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

        it('saved small image should be 400x267', async () => {
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

    context('with correct source, different destination a small image with person and size auto detected and set file name in destination', () => {

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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '400x267',
                preserved: true,
                detected: 'person',
                size: 'small'
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

        it('saved small image should be 400x267', async () => {
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

        it('outcome should be hd and charged 5 credits', () => {
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
                charged: 5,
                dimensions: '2400x1600',
                preserved: true,
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

    context('with correct source, same destination an hd image with person and size forced to small', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        const testFile = `${dir}/${testFile_HQ}.jpg`;

        it('should return object', async () => {

            outcome = await removd.file({
                size: 'small',
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

        it('outcome should be small and charged 1 credit', () => {
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
                charged: 1,
                dimensions: '612x408',
                preserved: true,
                detected: 'person',
                size: 'small'
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

        it('saved small image should be 612x408', async () => {
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

        it('outcome should be medium and charged 3 credits', () => {
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
                charged: 3,
                dimensions: '1500x1000',
                preserved: true,
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
                dimensions: '3750x2500',
                preserved: true,
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
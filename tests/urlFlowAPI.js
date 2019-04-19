const path = require('path');
const expect = require('chai').expect;
const del = require('del');
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const testFile = 'https://images.unsplash.com/photo-1504455583697-3a9b04be6397?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=';
const testFileProduct1 = "https://images.unsplash.com/photo-1544441892-794166f1e3be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=";
const testFileProduct2 = "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=";
const testFile_LQ = `${testFile}400&q=80`;
const testFileProduct_LQ = `${testFileProduct1}400&q=80`;
const testFile_MQ = `${testFile}1500&q=80`;
const testFileProduct_MQ = `${testFileProduct2}1029&q=80`;
const testFile_HQ = `${testFile}2400&q=80`;
const testFile_UHD = `${testFile}3750&q=80`;
const testFile_LQ_green = 'https://images.unsplash.com/photo-1496769336828-c522a3a7e33c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80';
const targetName = 'unsplash-photo';
const dir = path.resolve(__dirname, `../assets/`);

describe('# service API url workflow', () => {

    const recorder = record(path.parse(__filename).name);
    before(recorder.before);

    context('with correct source and image without persons', () => {

        it('should return no persons found error', async () => {

            await del([`${dir}/*.png`]);

            const failedOutcome = await removd.url({
                destination: `${dir}/${targetName}.png`,
                source: testFile_LQ_green
            });

            expect(failedOutcome).to.deep.equal({
                error: "Could not find person or product in image. For details and recommendations see https://www.remove.bg/supported-images.",
                source: testFile_LQ_green
            });

        });

    });

    context('with correct source and destination a regular image with person and size autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                destination: dir,
                source: testFile_LQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a regular image with person, size autodetected and alpha channels', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                channels: 'alpha',
                destination: dir,
                source: testFile_LQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a regular image with person and size set to auto and detect set', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                size: 'auto',
                detect: 'person',
                destination: dir,
                source: testFile_LQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
        });

    });

    context('with correct source and destination a regular image with product and size autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                destination: dir,
                source: testFileProduct_LQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFileProduct_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
                detected: 'product',
                size: 'regular'
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

        });

    });

    context('with correct source and destination a hd image with product set and alpha channels', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                detect: 'product',
                channels: 'alpha',
                destination: dir,
                source: testFileProduct_MQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFileProduct_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
                dimensions: '1029x1543',
                detected: 'product',
                size: 'hd'
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

        it('destinaton extension should not have a transparency', () => {
            expect(destinationFile.ext).to.equal('.jpeg');
        });

        it('saved hd image should be 1029x1543', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1029,
                height: 1543
            });

            await del([`${dir}/*.jpeg`]);

        });

    });

    context('with correct source and destination a hd image with format set and named background color', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                format: 'jpg',
                background: 'blue',
                destination: dir,
                source: testFileProduct_MQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFileProduct_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
                dimensions: '1029x1543',
                detected: 'product',
                size: 'hd'
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

        it('destinaton extension should not have a transparency', () => {
            expect(destinationFile.ext).to.equal('.jpeg');
        });

        it('saved hd image should be 1029x1543', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1029,
                height: 1543
            });

            await del([`${dir}/*.jpeg`]);

        });

    });

    context('with correct source and destination a hd image with hex background and product autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                background: '81d4fa77',
                destination: dir,
                source: testFileProduct_MQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFileProduct_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
                dimensions: '1029x1543',
                detected: 'product',
                size: 'hd'
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

        it('destinaton extension should have a transparency', () => {
            expect(destinationFile.ext).to.equal('.png');
        });

        it('saved hd image should be 1029x1543', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1029,
                height: 1543
            });

        });

    });

    context('with correct source and destination a hd image with rgba background set and product autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        let deconstructed = [];

        it('should return object', async () => {

            outcome = await removd.url({
                background: 'rgba(197, 127, 73, .5)',
                destination: dir,
                source: testFileProduct_MQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFileProduct_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

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
                dimensions: '1029x1543',
                detected: 'product',
                size: 'hd'
            });

        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            deconstructed = destinationFile.name.split('-');
            const id = deconstructed.pop();
            expect(`${sourceFile.name}`).to.equal(`${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('saved hd image should be 1029x1543', async () => {
            const {
                width,
                height
            } = await common.getDimensions(outcome.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1029,
                height: 1543
            });

        });

    });

    context('with correct source and destination a regular image with person and filename bumped and size autodetected', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};
        let deconstructed = [];

        it('should return object', async () => {

            outcome = await removd.url({
                destination: dir,
                source: testFile_LQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            deconstructed = destinationFile.name.split('-');
            const id = deconstructed.pop();
            expect(`${sourceFile.name}`).to.equal(`${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a regular image with person and set name and size autodetected', () => {

        let outcome = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                destination: `${dir}/${targetName}.png`,
                source: testFile_LQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(outcome.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: outcome.destination
            });
        });

        it('source and destinaton file names should match', () => {
            expect(`${destinationFile.name}`).to.equal(`${targetName}`);
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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a medium image with person', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                size: 'medium',
                destination: dir,
                source: testFile_MQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination an hd image with person and size forced to regular', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                size: 'regular',
                destination: dir,
                source: testFile_HQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_HQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should be resized', () => {
            expect(outcome.resized).to.be.true;
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
                dimensions: '612x408',
                detected: 'person',
                size: 'regular'
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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a hd image with person', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                size: 'hd',
                destination: dir,
                source: testFile_HQ
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_HQ);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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
            await del([`${dir}/*.png`]);
        });

    });

    context('with correct source and destination a 4k image with person', () => {

        let outcome = {};
        let sourceFile = {};
        let destinationFile = {};

        it('should return object', async () => {

            outcome = await removd.url({
                size: '4k',
                destination: dir,
                source: testFile_UHD
            });

            expect(outcome).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected');

            const url = new URL(testFile_UHD);
            sourceFile = path.parse(url.pathname.split('/').pop());
            destinationFile = path.parse(outcome.destination);

        });

        it('destination file should not be resized', () => {
            expect(outcome.resized).to.be.false;
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
            await del([`${dir}/*.png`]);
        });

    });

    after(recorder.after);

});
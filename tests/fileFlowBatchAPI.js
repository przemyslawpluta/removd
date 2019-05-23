const path = require('path');
const del = require('del');
const expect = require('chai').expect;
const record = require('./record');
const common = require('../lib/common');
const removd = require('../removd');

const mainName = 'christopher-campbell-28567-unsplash';
const testFile_LQ = `${mainName}-400x267`;
const testFile_MQ = `${mainName}-1500x1000`;
const testFile_HQ = `${mainName}-2400x1600`;
const testFile_UHD = `${mainName}-3750x2500`;
const dir = path.resolve(__dirname, '../assets/');

describe('# file workflow batch service batch API', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('with batch source and image with and without a person', () => {

        let out = {};
        let success = {};
        let done = [];

        it('should return an error and succesfull image', async () => {

            await del([`${dir}/*.png`]);

            done = await removd.file({
                source: [
                    `${dir}/${testFile_LQ}-green.jpg`,
                    `${dir}/${testFile_LQ}.jpg`
                ]
            });

            expect(done).to.be.an('array').to.have.lengthOf(2);

            out = done.filter(item => item.error).shift();

        });

        it('should return no persons found error for one of the images', () => {

            expect(out).to.deep.equal({
                error: 'Could not find person, product or car in image. For details and recommendations see https://www.remove.bg/supported-images.',
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

        it('should return successfully processed image for another', () => {

            success = done.filter(item => item.dimensions === '400x267').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
                preserved: true,
                size: 'small'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_LQ}.jpg`));
        });

        it('saved small image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

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

    context('with batch source and image with a person and size set to auto', () => {

        let success = {};
        let done = [];

        it('should return an error and succesfull image', async () => {

            await del([`${dir}/*.png`]);

            done = await removd.file({
                size: 'auto',
                source: [
                    `${dir}/${testFile_LQ}.jpg`,
                    `${dir}/${testFile_MQ}.jpg`,
                    `${dir}/${testFile_HQ}.jpg`,
                    `${dir}/${testFile_UHD}.jpg`
                ]
            });

            expect(done).to.be.an('array').to.have.lengthOf(4);

        });

        it('should return successfully processed small image', () => {

            success = done.filter(item => item.dimensions === '400x267').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_LQ}.jpg`));
        });

        it('saved small image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
        });

        it('should return successfully processed medium image', () => {

            success = done.filter(item => item.dimensions === '1500x1000').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 3,
                dimensions: '1500x1000',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_MQ}.jpg`));
        });

        it('saved medium image should be 1500x1000', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1500,
                height: 1000
            });
        });

        it('should return successfully processed hd image', () => {

            success = done.filter(item => item.dimensions === '2400x1600').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 5,
                dimensions: '2400x1600',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_HQ}.jpg`));
        });

        it('saved hd image should be 2400x1600', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 2400,
                height: 1600
            });
        });

        it('should return successfully processed 4k image', () => {

            success = done.filter(item => item.dimensions === '3750x2500').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '3750x2500',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_UHD}.jpg`));
        });

        it('saved 4k image should be 3750x2500', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

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

    context('with glob batch source and image with and without a person and size autodetected', () => {

        let out = {};
        let success = {};
        let done = [];

        it('should return an error and succesfull image', async () => {

            await del([`${dir}/*.png`]);

            done = await removd.file({
                glob: true,
                source: [
                    `${dir}/*.jpg`
                ]
            });

            expect(done).to.be.an('array').to.have.lengthOf(6);

            out = done.filter(item => item.error).shift();

        });

        it('should return no persons found error for one of the images', () => {

            expect(out).to.deep.equal({
                error: 'Could not find person, product or car in image. For details and recommendations see https://www.remove.bg/supported-images.',
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

        it('should return successfully processed small image', () => {

            success = done.filter(item => item.destination === `${dir}/${testFile_LQ}.png`).shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
                preserved: true,
                size: 'small'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_LQ}.jpg`));
        });

        it('saved small image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
        });

        it('should return successfully processed small image', () => {

            success = done.filter(item => item.destination === `${dir}/${testFile_LQ}-tag.png`).shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
                preserved: true,
                size: 'small'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_LQ}-tag.jpg`));
        });

        it('saved small image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
        });

        it('should return successfully processed medium image', () => {

            success = done.filter(item => item.destination === `${dir}/${testFile_MQ}.png`).shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 3,
                dimensions: '1500x1000',
                detected: 'person',
                preserved: true,
                size: 'medium'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_MQ}.jpg`));
        });

        it('saved medium image should be 1500x1000', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1500,
                height: 1000
            });
        });

        it('should return successfully processed hd image', () => {

            success = done.filter(item => item.destination === `${dir}/${testFile_HQ}.png`).shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 5,
                dimensions: '2400x1600',
                detected: 'person',
                preserved: true,
                size: 'hd'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_HQ}.jpg`));
        });

        it('saved hd image should be 2400x1600', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 2400,
                height: 1600
            });
        });

        it('should return successfully processed 4k image', async () => {

            success = done.filter(item => item.destination === `${dir}/${testFile_UHD}.png`).shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '3750x2500',
                detected: 'person',
                preserved: true,
                size: '4k'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_UHD}.jpg`));
        });

        it('saved 4k image should be 3750x2500', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

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

    context('with batch source and image with a person and size set to auto with progress enabled', () => {

        let out = {};
        let success = {};
        let progress = [];
        let done = [];
        let files = [];

        function compare(a, b) {
            return a.charged - b.charged;
        }

        it('should return successfully processed images', async () => {

            await del([`${dir}/*.png`]);

            const batch = await removd.file({
                size: 'auto',
                progress: true,
                source: [
                    `${dir}/dummy.jpg`,
                    `${dir}/${testFile_LQ}-green.jpg`,
                    `${dir}/${testFile_LQ}.jpg`,
                    `${dir}/${testFile_MQ}.jpg`,
                    `${dir}/${testFile_HQ}.jpg`,
                    `${dir}/${testFile_UHD}.jpg`
                ]
            });

            files = batch.files;

            batch.progress.on('item', item => {
                progress.push(item);
            });

            done = await batch.init();

            expect(done).to.be.an('array').to.have.lengthOf(6);

        });

        it('should return list of files to be processed', () => {

            expect(files).to.be.an('array').to.have.lengthOf(6);

        });

        it('progress should return successfully processed list of images', () => {

            expect(progress).to.be.an('array').to.have.lengthOf(6);

            expect(done.sort(compare)).to.deep.equal(progress.sort(compare));

        });

        it('should return not a valid file error for one of the images', () => {

            out = done.filter(item => item.source === `${dir}/dummy.jpg`).shift();

            expect(out).to.deep.equal({
                error: 'Not a valid file',
                source: `${dir}/dummy.jpg`
            });

        });

        it('should return no persons found error for one of the images', () => {

            out = done.filter(item => item.source === `${dir}/${testFile_LQ}-green.jpg`).shift();

            expect(out).to.deep.equal({
                error: 'Could not find person or product in image. For details and recommendations see https://www.remove.bg/supported-images.',
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

        it('should return successfully processed small image', () => {

            success = done.filter(item => item.dimensions === '400x267').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 1,
                dimensions: '400x267',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_LQ}.jpg`));
        });

        it('saved small image should be 400x267', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 400,
                height: 267
            });
        });

        it('should return successfully processed medium image', () => {

            success = done.filter(item => item.dimensions === '1500x1000').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 3,
                dimensions: '1500x1000',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_MQ}.jpg`));
        });

        it('saved medium image should be 1500x1000', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 1500,
                height: 1000
            });
        });

        it('should return successfully processed hd image', () => {

            success = done.filter(item => item.dimensions === '2400x1600').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 5,
                dimensions: '2400x1600',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_HQ}.jpg`));
        });

        it('saved hd image should be 2400x1600', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

            expect({
                width,
                height
            }).to.deep.equal({
                width: 2400,
                height: 1600
            });
        });

        it('should return successfully processed 4k image', () => {

            success = done.filter(item => item.dimensions === '3750x2500').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized', 'detected', 'preserved');

            const {
                charged,
                dimensions,
                detected,
                preserved,
                size
            } = success;

            expect({
                charged,
                dimensions,
                detected,
                preserved,
                size
            }).to.deep.equal({
                charged: 8,
                dimensions: '3750x2500',
                detected: 'person',
                preserved: true,
                size: 'auto'
            });

        });

        it('destination file should not be resized', () => {
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_UHD}.jpg`));
        });

        it('saved 4k image should be 3750x2500', async () => {
            const {
                width,
                height
            } = await common.getDimensions(success.destination);

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
const path = require('path');
const expect = require('chai').expect;
const del = require('del');
const record = require('./record');
const removd = require('../removd');
const common = require('../lib/common');

const testFile = 'https://images.unsplash.com/photo-1504455583697-3a9b04be6397?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=';
const testFile_LQ = `${testFile}400&q=80`;
const testFile_MQ = `${testFile}1500&q=80`;
const testFile_HQ = `${testFile}2400&q=80`;
const testFile_UHD = `${testFile}3750&q=80`;
const testFile_LQ_green = 'https://images.unsplash.com/photo-1496769336828-c522a3a7e33c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80';
const dir = path.resolve(__dirname, `../assets/`);

describe('# url workflow batch service API', () => {

    const recorder = record(path.parse(__filename).name);
    before(recorder.before);

    context('with correct source and image without persons', () => {

        let out = {};
        let success = {};
        let url = {};
        let done = [];
        let sourceFile = null;

        it('should return no persons found error', async () => {

            await del([`${dir}/*.png`]);

            const source = [testFile_LQ_green, testFile_LQ, testFile_MQ, testFile_HQ, testFile_UHD];

            done = await removd.url({
                destination: `${dir}/`,
                source
            });

            expect(done).to.be.an('array').to.have.lengthOf(source.length);

            out = done.filter(item => item.error).shift();

        });

        it('should return no persons found error for one of the images', () => {

            expect(out).to.deep.equal({
                error: 'Could not find person, product or car in image. For details and recommendations see https://www.remove.bg/supported-images.',
                source: testFile_LQ_green
            });

        });

        it('should return successfully processed small image', () => {

            url = new URL(testFile_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());

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

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

            url = new URL(testFile_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());

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
                size: 'medium'
            });

        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = path.parse(success.destination).name.split('-');
            const id = deconstructed.pop();
            expect(`${dir}/${sourceFile.name}`).to.equal(`${dir}/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

            url = new URL(testFile_HQ);
            sourceFile = path.parse(url.pathname.split('/').pop());

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
                size: 'hd'
            });

        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = path.parse(success.destination).name.split('-');
            const id = deconstructed.pop();
            expect(`${dir}/${sourceFile.name}`).to.equal(`${dir}/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

            url = new URL(testFile_UHD);
            sourceFile = path.parse(url.pathname.split('/').pop());

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
                size: '4k'
            });

        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = path.parse(success.destination).name.split('-');
            const id = deconstructed.pop();
            expect(`${dir}/${sourceFile.name}`).to.equal(`${dir}/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

    context('with correct source and image without persons and progress enabled', () => {

        let out = {};
        let success = {};
        let url = {};
        let done = [];
        let progress = [];
        let files = [];
        let sourceFile = null;
        let source = [];

        function compare(a, b) {
            return a.charged - b.charged;
        }

        it('should return successfully processed images', async () => {

            await del([`${dir}/*.png`]);

            source = [testFile_LQ_green, testFile_LQ, testFile_MQ, testFile_HQ, testFile_UHD];

            const batch = await removd.url({
                destination: `${dir}/`,
                progress: true,
                source
            });

            files = batch.files;

            batch.progress.on('item', item => {
                progress.push(item);
            });

            done = await batch.init();

            expect(done).to.be.an('array').to.have.lengthOf(source.length);

        });

        it('should return list of files to be processed', () => {

            expect(files).to.be.an('array').to.have.lengthOf(source.length);

        });

        it('progress should return successfully processed list of images', () => {

            expect(progress).to.be.an('array').to.have.lengthOf(source.length);

            expect(done.sort(compare)).to.deep.equal(progress.sort(compare));

        });

        it('should return no persons found error for one of the images', () => {

            out = done.filter(item => item.error).shift();

            expect(out).to.deep.equal({
                error: 'Could not find person, product or car in image. For details and recommendations see https://www.remove.bg/supported-images.',
                source: testFile_LQ_green
            });

        });

        it('should return successfully processed small image', () => {

            url = new URL(testFile_LQ);
            sourceFile = path.parse(url.pathname.split('/').pop());

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

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

            url = new URL(testFile_MQ);
            sourceFile = path.parse(url.pathname.split('/').pop());

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
                size: 'medium'
            });

        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = path.parse(success.destination).name.split('-');
            const id = deconstructed.pop();
            expect(`${dir}/${sourceFile.name}`).to.equal(`${dir}/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

            url = new URL(testFile_HQ);
            sourceFile = path.parse(url.pathname.split('/').pop());

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
                size: 'hd'
            });

        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = path.parse(success.destination).name.split('-');
            const id = deconstructed.pop();
            expect(`${dir}/${sourceFile.name}`).to.equal(`${dir}/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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

            url = new URL(testFile_UHD);
            sourceFile = path.parse(url.pathname.split('/').pop());

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
                size: '4k'
            });

        });

        it('source and destinaton file names should not match with id added to destinaton filename', () => {
            const deconstructed = path.parse(success.destination).name.split('-');
            const id = deconstructed.pop();
            expect(`${dir}/${sourceFile.name}`).to.equal(`${dir}/${deconstructed.join('-')}`);
            expect(id).to.have.lengthOf(9);
        });

        it('should save new image in destination directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
            });
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
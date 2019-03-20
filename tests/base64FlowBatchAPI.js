const fs = require('fs');
const path = require('path');
const util = require('util');
const del = require('del');
const expect = require('chai').expect;
const removd = require('../removd');
const common = require('../lib/common');
const record = require('./record');

const unlink = util.promisify(fs.unlink);

const mainName = 'christopher-campbell-28567-unsplash';
const testFile_LQ = `${mainName}-400x267`;
const testFile_MQ = `${mainName}-1500x1000`;
const testFile_HQ = `${mainName}-2400x1600`;
const testFile_UHD = `${mainName}-3750x2500`;
const dir = path.resolve(__dirname, `../assets/`);

describe('# service API base64 workflow test', () => {

    const recorder = record(path.parse(__filename).name);
    before(recorder.before);

    context('with correct source and image without persons', () => {

        let out = {};
        let success = {};
        let sourceFile = {};
        let destinationFile = {};
        let done = [];

        it('should return no persons found error', async () => {

            await del([`${dir}/*.png`]);

            done = await removd.base64({
                source: [
                    `${dir}/${testFile_LQ}-green.jpg`,
                    `${dir}/${testFile_MQ}.jpg`,
                    `${dir}/${testFile_HQ}.txt`,
                    `${dir}/${testFile_LQ}-url.txt`,
                    `${dir}/${testFile_UHD}.txt`
                ]
            });

            expect(done).to.be.an('array').to.have.lengthOf(5);

            out = done.filter(item => item.error).shift();

        });

        it('should return no persons found error for one of the images', () => {

            expect(out).to.deep.equal({
                error: 'No persons found: At the moment remove.bg only works for photos with at least one person in them. Sorry – please select an appropriate image.',
                source: `${dir}/${testFile_LQ}-green.jpg`
            });

        });

        it('should return succesfully processed image for medium quality image', () => {

            success = done.filter(item => item.dimensions === '1500x1000').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

            const {
                charged,
                dimensions,
                size
            } = success;

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
            await del([`${dir}/*.png`]);
        });

        it('outcome should be regular url encoded image and charged 1 credit', () => {

            success = done.filter(item => item.dimensions === '400x267').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

            sourceFile = path.parse(`${dir}/${testFile_LQ}-url.txt`);
            destinationFile = path.parse(success.destination);

            const {
                charged,
                dimensions,
                size
            } = success;

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
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_LQ}-url.txt`));
        });

        it('should save new image in source\'s original directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
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
            await unlink(success.destination);
        });

        it('outcome should be hd and charged 5 credit', () => {

            success = done.filter(item => item.dimensions === '2400x1600').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

            sourceFile = path.parse(`${dir}/${testFile_HQ}.txt`);
            destinationFile = path.parse(success.destination);

            const {
                charged,
                dimensions,
                size
            } = success;

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
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_HQ}.txt`));
        });

        it('should save new image in source\'s original directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
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
            await unlink(success.destination);
        });

        it('outcome should be 4k and charged 8 credit', () => {

            success = done.filter(item => item.dimensions === '3750x2500').shift();

            expect(success).to.be.an('object').that.has.all.keys('charged', 'size', 'duration', 'dimensions', 'destination', 'resized');

            sourceFile = path.parse(`${dir}/${testFile_UHD}.txt`);
            destinationFile = path.parse(success.destination);

            const {
                charged,
                dimensions,
                size
            } = success;

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
            expect(success.resized).to.be.false;
        });

        it('source and destination paths should match', () => {
            expect(path.dirname(success.destination)).to.equal(path.dirname(`${dir}/${testFile_UHD}.txt`));
        });

        it('should save new image in source\'s original directory', async () => {
            const product = await common.currentFile(success.destination);
            expect(product).to.deep.equal({
                exists: true,
                source: success.destination
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
            await unlink(success.destination);
        });

    });

    after(recorder.after);

});
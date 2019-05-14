const fs = require('fs');
const util = require('util');
const sharp = require('sharp');
const common = require('../lib/common');

const readFile = util.promisify(fs.readFile);

async function normaliseSource(options, detail) {
    let current = null;
    if (detail.ext === '.txt') {
        const data = (await readFile(options.source)).toString();
        current = Buffer.from(data.trim().substring(data.indexOf(',')), 'base64');
    }
    return current || options.source;
}

async function downscale(options, detail, quality = 82, drop = 2) {

    const source = await normaliseSource(options, detail);

    const done = await sharp(source).resize({
        width: detail.maxWidth,
        height: detail.maxHeight,
        fit: sharp.fit.inside
    }).jpeg({
        quality,
        chromaSubsampling: '4:4:4',
    }).withMetadata().toBuffer();

    if (done.byteLength > 8000000) {
        return downscale(options, detail, quality - drop);
    }

    detail.altered = true;

    return {
        detail,
        file: done.toString('base64')
    };
}


function upscale(detail, ext) {

    if (ext === 'png') {
        return sharp().resize({
            width: detail.width,
            height: detail.height,
            fit: sharp.fit.inside
        }).png().withMetadata();
    }

    return sharp().resize({
        width: detail.maxWidth,
        height: detail.maxHeight,
        fit: sharp.fit.inside
    }).jpeg({
        quality: 93,
        chromaSubsampling: '4:4:4',
    }).withMetadata();

}

async function validate(options, id) {

    const detail = await common.getDimensions(options.source, id);

    if (detail.error) {
        return detail;
    }

    if (id === 'fileWorkflow' || (id === 'base64Workflow' && detail.ext !== '.txt')) {

        if (!options.preserve || (options.preserve && detail.preserved)) {
            return {
                detail,
                file: await readFile(options.source, {
                    encoding: 'base64'
                })
            };
        }

        return await downscale(options, detail);

    }

    if (id === 'urlWorkflow') {

        if (!options.preserve || (options.preserve && detail.preserved)) {
            return {
                detail
            };
        }

        detail.altered = true;

        return {
            detail
        };

    }

    if (id === 'base64Workflow' && detail.ext === '.txt') {

        if (!options.preserve || (options.preserve && detail.preserved)) {

            const data = (await readFile(options.source)).toString();

            return {
                detail,
                file: data.trim().substring(data.indexOf(','))
            };
        }

        return await downscale(options, detail);

    }

}

module.exports = {
    validate,
    upscale
};
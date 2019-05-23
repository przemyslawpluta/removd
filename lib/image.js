const fs = require('fs');
const sharp = require('sharp');
const base64 = require('base64-stream');
const stripBomStream = require('strip-bom-stream');
const common = require('../lib/common');

function downscale(options, detail, quality = 82) {

    const source = fs.createReadStream(options.source);

    const transform = (detail.ext !== '.txt') ? source : source.pipe(stripBomStream()).pipe(common.stripDataUriStream(detail.dataUrl)).pipe(new base64.Base64Decode());

    const resize = sharp().resize({
        width: detail.maxWidth,
        height: detail.maxHeight,
        fit: sharp.fit.inside
    }).jpeg({
        quality,
        chromaSubsampling: '4:4:4',
    }).withMetadata();

    detail.altered = true;

    return {
        detail,
        file: transform.pipe(resize).pipe(new base64.Base64Encode())
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
                file: fs.createReadStream(options.source, {
                    encoding: 'base64'
                })
            };
        }

        return downscale(options, detail);

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

            return {
                detail,
                file: fs.createReadStream(options.source).pipe(stripBomStream()).pipe(common.stripDataUriStream(detail.dataUrl))
            };
        }

        return downscale(options, detail);

    }

}

module.exports = {
    validate,
    upscale
};
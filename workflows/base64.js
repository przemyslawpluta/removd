const fs = require('fs');
const util = require('util');
const path = require('path');
const validDataUrl = require('valid-data-url');
const isBase64 = require('is-base64');
const common = require('../lib/common');
const read = util.promisify(fs.readFile);

async function b64Flow(source) {
    let file = await read(source, {
        encoding: 'utf8'
    });

    file = file.toString().trim();

    const dataurl = validDataUrl(file);

    if (dataurl) {
        file = file.substring(file.indexOf(',') + 1);
    }

    if (!isBase64(file)) {
        return {
            error: 'Not a valid base64 file',
            source
        };
    }

    return {
        file,
        dataurl
    };
}

async function imgFlow(source) {
    const file = await read(source, {
        encoding: 'base64'
    });

    if (!isBase64(file)) {
        return {
            error: 'Not a valid base64 file',
            source
        };
    }

    return file;
}

async function base64Workflow(options) {

    if (!options.source) {
        return {
            error: 'Missing source file'
        };
    }

    if (!(await common.currentFile(options.source)).exists) {
        return {
            error: 'Not a valid file',
            source: options.source
        };
    }

    const resizedFile = path.parse(options.source);

    if (!common.supportedFiles(resizedFile.ext, ['.txt'])) {
        return {
            error: 'Unsupported file format',
            source: options.source
        };
    }

    let dim = await common.getDimensions(options.source);

    let image_file_b64 = null;
    let b64DataFlow = false;
    let b64StringFlow = false;
    let original = null;
    const b64ToImage = (options.toImage) ? true : false;

    if (dim.error && dim.error.indexOf('unsupported file type') === 0 && resizedFile.ext === '.txt') {
        b64StringFlow = true;
        const file_b64 = await b64Flow(options.source);
        if (file_b64.error) {
            return {
                error: file_b64.error
            };
        }
        image_file_b64 = file_b64.file || file_b64;
        dim = await common.getDimensions(Buffer.from(image_file_b64, 'base64'));
        if (dim.error) {
            return {
                error: dim.error
            };
        }
        original = [dim.width, dim.height];
        if (file_b64.dataurl) {
            b64DataFlow = file_b64.dataurl;
        }
    } else {
        if (!common.supportedFiles(resizedFile.ext)) {
            return {
                error: 'Unsupported file format',
                source: options.source
            };
        }
        image_file_b64 = await imgFlow(options.source);
        original = [dim.width, dim.height];
    }

    if (image_file_b64.error) {
        return {
            error: image_file_b64.error
        };
    }

    const formData = {
        image_file_b64,
        size: dim.size,
        channels: 'rgba',
        type: 'auto'
    };

    const size = common.support(formData, options, 'size');

    if (size.error) {
        return size;
    }

    const channels = common.support(formData, options, 'channels');

    if (channels.error) {
        return channels;

    }

    const detect = common.support(formData, options, 'detect');

    if (detect.error) {
        return detect;

    }

    let file = null;
    let checkDestination = null;
    const assignExt = ((b64StringFlow && !b64ToImage) ? resizedFile.ext : '.png');

    if (!options.destination) {
        options.destination = resizedFile.dir;
    } else {
        checkDestination = path.parse(options.destination);

        if (checkDestination.name && checkDestination.ext) {
            file = {
                name: checkDestination.name + assignExt
            };
        }

        if (file) {
            options.destination = checkDestination.dir;
        }
    }

    const cutOutName = (file) ? file.name : resizedFile.name + assignExt;
    let destination = path.resolve(options.destination) + `/${cutOutName}`;

    const out = {
        formData,
        destination,
        b64ToImage,
        b64DataFlow,
        b64StringFlow
    };

    if (original) {
        out.original = original;
    }

    return out;
}

module.exports = base64Workflow;
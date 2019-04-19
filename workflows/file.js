const fs = require('fs');
const util = require('util');
const path = require('path');
const common = require('../lib/common');

const read = util.promisify(fs.readFile);

async function fileWorkflow(options) {

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

    if (!common.supportedFiles(resizedFile.ext)) {
        return {
            error: 'Unsupported file format',
            source: options.source
        };
    }

    const dim = await common.getDimensions(options.source);

    const formData = {
        image_file_b64: await read(options.source, {
            encoding: 'base64'
        }),
        size: dim.size,
        channels: 'rgba',
        bg_color: '00000000',
        format: 'auto',
        type: 'auto',
    };

    const validate = ['size', 'channels', 'detect', 'format', 'background'].map(item => common.support(formData, options, item)).filter(item => item.error);

    if (validate.length) {
        return validate.shift();
    }

    let file = null;
    let checkDestination = null;

    if (!options.destination) {
        options.destination = resizedFile.dir;
    } else {
        checkDestination = path.parse(options.destination);

        if (checkDestination.name && checkDestination.ext) {
            file = {
                name: checkDestination.name + '.png'
            };
        }

        if (file) {
            options.destination = checkDestination.dir;
        }
    }

    const cutOutName = (file) ? file.name : resizedFile.name + '.png';
    const destination = path.resolve(options.destination) + `/${cutOutName}`;

    const out = {
        formData,
        original: [dim.width, dim.height],
        destination
    };

    return out;
}

module.exports = fileWorkflow;
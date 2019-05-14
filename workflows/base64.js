const path = require('path');
const common = require('../lib/common');
const image = require('../lib/image');

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

    const resource = await image.validate(options, arguments.callee.name);

    if (resource.error) {
        return {
            ...resource,
            source: options.source
        };
    }

    const b64ToImage = (options.toImage) ? true : false;

    const formData = {
        image_file_b64: resource.file,
        size: resource.detail.size,
        channels: 'rgba',
        bg_color: '00000000',
        format: 'auto',
        type: 'auto'
    };

    const validate = ['size', 'channels', 'detect', 'format', 'background'].map(item => common.support(formData, options, item)).filter(item => item.error);

    if (validate.length) {
        return validate.shift();
    }

    const resizedFile = path.parse(options.source);

    let file = null;
    let checkDestination = null;
    const assignExt = ((resource.detail.ext === '.txt' && !b64ToImage) ? resizedFile.ext : '.png');

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

    return {
        formData,
        detail: resource.detail,
        destination: path.resolve(options.destination) + `/${cutOutName}`,
        b64ToImage
    };

}

module.exports = base64Workflow;
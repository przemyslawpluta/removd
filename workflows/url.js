const path = require('path');
const common = require('../lib/common');
const image = require('../lib/image');

async function urlWorkflow(options) {

    if (!options.source) {
        return {
            error: 'Source url required'
        };
    }

    let url = {};

    try {
        url = new URL(options.source);
    } catch (e) {
        return {
            error: e.message
        };
    }

    if (!options.destination) {
        return {
            error: 'Destination required'
        };
    }

    let file = null;

    const checkDestination = path.parse(options.destination);

    if (checkDestination.name && checkDestination.ext) {
        file = {
            name: checkDestination.name + '.png'
        };
    }

    if (!file) {
        checkDestination.dir = checkDestination.dir + '/' + checkDestination.base;
    }

    if (!file) {
        const testName = path.parse(url.pathname.split('/').pop());
        file = {
            name: testName.name + '.png'
        };
    }

    if (!file) {
        return {
            error: 'Destination file name required'
        };
    }

    const formData = {
        image_url: url.href,
        channels: 'rgba',
        bg_color: '00000000',
        format: 'auto',
        type: 'auto'
    };

    const validate = ['size', 'channels', 'detect', 'format', 'background'].map(item => common.support(formData, options, item)).filter(item => item.error);

    if (validate.length) {
        return validate.shift();
    }

    const resource = await image.validate(options, arguments.callee.name);

    if (resource.error) {
        return {
            ...resource,
            source: options.source
        };
    }

    if (!formData.size) {
        formData.size = resource.detail.size;
    }

    return {
        formData,
        destination: checkDestination.dir + '/' + file.name,
        detail: resource.detail
    };

}

module.exports = urlWorkflow;
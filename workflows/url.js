const path = require('path');
const common = require('../lib/common');

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

    let original = null;

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

    const dim = await common.getDimensionsUrl(options.source);

    if (dim.error) {
        return dim;
    }

    original = [dim.width, dim.height];

    if (!formData.size) {
        formData.size = dim.size;
    }

    const cutOutName = file.name;
    let destination = checkDestination.dir + '/' + cutOutName;

    let out = {
        formData,
        destination
    };

    if (original) {
        out.original = original;
    }

    return out;
}

module.exports = urlWorkflow;
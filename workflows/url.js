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
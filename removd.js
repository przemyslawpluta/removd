require('dotenv').config();

const once = require('./lib/once');
const batch = require('./lib/batch');
const balance = require('./lib/balance');

function check(workflow, options) {

    const api_key = process.env.REMOVD_API_KEY || options.apikey;

    if (!api_key) {
        return {
            error: 'Missing remove.bg service API key'
        };
    }

    if (workflow === 'account') {
        return balance(options);
    }

    if (!options) {
        return {
            error: 'Missing paremeters'
        };
    }

    if (!options.source) {
        return {
            error: `Missing source ${(workflow === 'url') ? workflow : 'file'}`
        };
    }

    options.workflow = workflow;

    if (typeof options.source === 'string') {
        return once(options);
    }

    if (typeof options.source === 'object' && options.source.length) {
        return batch(options);
    }
}

function file(options) {
    return check(arguments.callee.name, options);
}

function url(options) {
    return check(arguments.callee.name, options);
}

function base64(options) {
    return check(arguments.callee.name, options);
}

function account(options) {
    return check(arguments.callee.name, options);
}

module.exports = {
    file,
    url,
    base64,
    account
};
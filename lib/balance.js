const fetch = require('node-fetch');
const common = require('./common');

async function balance(options) {

    const res = await common.outcome(fetch('https://api.remove.bg/v1.0/account', {
        method: 'GET',
        headers: {
            'X-Api-Key': process.env.REMOVD_API_KEY || options.api_key,
            'Content-Type': 'application/json'
        }
    }));

    if (!res.success) {
        return {
            error: res.error.message
        };
    }

    if (res.result.status !== 200) {
        const data = await common.outcome(res.result.json());
        return {
            error: (!data.success) ? res.result.statusText : data.result.errors.shift().title
        };
    }

    const current = await common.outcome(res.result.json());

    return current.result.data.attributes;

}

module.exports = balance;
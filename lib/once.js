const workflows = require('./workflows');
const manage = require('./manage');

async function once(options) {

    const workflow = await workflows(options);

    if (workflow.error) {
        return workflow;
    }

    return await manage(process.env.REMOVD_API_KEY || options.apikey, workflow, options);

}

module.exports = once;
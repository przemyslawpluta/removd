const os = require('os');
const globby = require('globby');
const manage = require('./manage');
const workflows = require('./workflows');

let api_key = null;

async function processInBatch(options, done = [], count = 0, total = 0) {

    if (!total) {
        total = options.list.success.length;
    }

    const batch = options.list.success.splice(0, options.count);

    const extracted = await Promise.all(batch.map(item => {
        return manage(api_key, item.workflow, item.options);
    }));

    done = [...done, ...extracted];

    if (options.list.success.length) {
        return processInBatch(options, done, count, total);
    }

    return [...done, ...options.list.failed];
}

async function batch(options) {

    api_key = process.env.REMOVD_API_KEY || options.apikey;

    let allFiles = [];

    const current = (({
        source,
        ...others
    }) => ({
        ...others
    }))(options);

    if (options.glob && ['file', 'base64'].includes(options.workflow)) {
        allFiles = await globby(options.source);
    } else {
        allFiles = options.source;
    }

    const build = await Promise.all(allFiles.map(async item => {
        const options = {
            ...current
        };
        options.source = item;
        return {
            options,
            workflow: await workflows(options)
        };
    }));

    const list = {
        success: build.filter(item => !item.workflow.error),
        failed: build.filter(item => item.workflow.error).map(item => {
            return {
                error: item.workflow.error,
                source: item.options.source
            };
        })
    };

    return await processInBatch({
        list,
        count: process.env.REMOVD_BATCH_LIMIT || os.cpus().length
    });

}

module.exports = batch;
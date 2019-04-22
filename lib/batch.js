const os = require('os');
const globby = require('globby');
const EventEmitter = require('events');
const manage = require('./manage');
const workflows = require('./workflows');

let api_key = null;

async function processInBatch(options, done = [], total = 0) {

    if (!total) {
        total = options.list.success.length;
    }

    const batch = options.list.success.splice(0, options.count);

    const extracted = await Promise.all(batch.map(item => {
        return manage(api_key, item.workflow, item.options, options.progress);
    }));

    done = [...done, ...extracted];

    if (options.list.success.length) {
        return processInBatch(options, done, total);
    }

    if (options.progress && options.list.failed.length) {
        options.list.failed.forEach(item => {
            options.progress.emit('item', item);
        });
    }

    return [...done, ...options.list.failed];
}

function batch(options) {

    const progress = (!options.progress) ? null : new EventEmitter();

    return (async (options, progress) => {

        api_key = process.env.REMOVD_API_KEY || options.apikey;

        let files = [];

        const current = (({
            source,
            ...others
        }) => ({
            ...others
        }))(options);

        if (options.glob && ['file', 'base64'].includes(options.workflow)) {
            files = await globby(options.source);
        } else {
            files = options.source;
        }

        const build = await Promise.all(files.map(async item => {
            const options = {
                ...current
            };
            options.source = item;
            return {
                options,
                workflow: await workflows(options)
            };
        }));

        const data = {
            count: process.env.REMOVD_BATCH_LIMIT || os.cpus().length,
            list: {
                success: build.filter(item => !item.workflow.error),
                failed: build.filter(item => item.workflow.error).map(item => {
                    return {
                        error: item.workflow.error,
                        source: item.options.source
                    };
                })
            }
        };

        if (!options.progress) {
            return await processInBatch(data);
        }

        return {
            files,
            progress,
            async init() {
                return await processInBatch({
                    ...data,
                    ...{
                        progress
                    }
                });
            }
        };

    })(options, progress);

}

module.exports = batch;
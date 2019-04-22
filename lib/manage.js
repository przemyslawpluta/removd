const fs = require('fs');
const util = require('util');
const path = require('path');
const stream = require('stream');
const mime = require('mime');
const fetch = require('node-fetch');
const prettyHrtime = require('pretty-hrtime');
const base64Encode = require('base64-stream').Base64Encode;
const common = require('./common');

const pipeline = util.promisify(stream.pipeline);

function emit(target, data) {
    if (target) {
        target.emit('item', data);
    }
    return data;
}

async function manage(api_key, workflow, options, progress) {

    const start = process.hrtime();

    const res = await common.outcome(fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': api_key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflow.formData)
    }));

    if (!res.success) {
        return emit(progress, {
            error: res.error.message,
            source: options.source
        });
    }

    if (res.result.status !== 200) {
        const dump = await common.outcome(res.result.json());
        return emit(progress, {
            error: (!dump.success) ? res.result.statusText : dump.result.errors.shift().title,
            source: options.source
        });
    }

    let streamChain = [];

    let mainBuffer = await res.result.buffer();

    if (!common.isUtf8Representable(mainBuffer)) {
        mainBuffer = Buffer.from(mainBuffer.toString('utf8'), 'hex');
    }

    const buff = common.bufferToStream(mainBuffer);

    const ext = mime.getExtension(res.result.headers.get('content-type'));
    const fileDestination = path.parse(workflow.destination);

    if (fileDestination.ext !== '.txt') {
        workflow.destination = (fileDestination.ext === `.${ext}`) ? workflow.destination : `${fileDestination.dir}/${fileDestination.name}.${ext}`;
    }

    workflow.destination = await common.bumpIfExists(workflow.destination);

    if (options.workflow === 'base64' && workflow.b64StringFlow) {

        const b64Prefix = (workflow.b64DataFlow && !workflow.b64ToImage) ? {
            prefix: `data:${res.result.headers.get('content-type')};base64,`
        } : {};

        const enc = (workflow.b64ToImage) ? {
            encoding: 'base64'
        } : {};

        streamChain = [new base64Encode(b64Prefix), fs.createWriteStream(workflow.destination, enc)];

    } else {

        streamChain = [fs.createWriteStream(workflow.destination)];

    }

    await pipeline(...[buff], ...streamChain);

    const end = process.hrtime(start);

    if (['file', 'base64'].includes(options.workflow) && options.deleteOriginal) {
        fs.unlink(options.source, () => {});
    }

    const outcome = {
        charged: Number(res.result.headers.get('x-credits-charged')),
        size: workflow.formData.size,
        duration: prettyHrtime(end),
        dimensions: res.result.headers.get('x-width') + 'x' + res.result.headers.get('x-height'),
        detected: res.result.headers.get('x-type'),
        destination: workflow.destination
    };

    if (workflow.original) {
        let resized = false;

        if (Number(res.result.headers.get('x-width')) < workflow.original[0] || Number(res.result.headers.get('x-height') < workflow.original[1])) {
            resized = true;
        }

        outcome.resized = resized;

    }

    return emit(progress, outcome);

}

module.exports = manage;
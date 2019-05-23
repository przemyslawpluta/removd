const fs = require('fs');
const util = require('util');
const path = require('path');
const stream = require('stream');
const mime = require('mime');
const fetch = require('node-fetch');
const prettyHrtime = require('pretty-hrtime');
const base64Encode = require('base64-stream').Base64Encode;
const uuid = require('uuid/v1');
const common = require('./common');
const image = require('../lib/image');

const pipeline = util.promisify(stream.pipeline);
const rename = util.promisify(fs.rename);

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
        body: common.combineStreams(workflow.formData)
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

    let dimensions = res.result.headers.get('x-width') + 'x' + res.result.headers.get('x-height');

    const ext = mime.getExtension(res.result.headers.get('content-type'));
    const fileDestination = path.parse(workflow.destination);

    if (fileDestination.ext !== '.txt') {
        workflow.destination = (fileDestination.ext === `.${ext}`) ? workflow.destination : `${fileDestination.dir}/${fileDestination.name}.${ext}`;
    }

    const original = workflow.destination;

    workflow.destination = path.dirname(workflow.destination) + '/' + uuid() + path.extname(workflow.destination);

    if (options.workflow === 'base64' && workflow.detail.ext === '.txt') {

        const dataUrl = (workflow.detail.dataUrl && !workflow.b64ToImage) ? {
            prefix: `data:${res.result.headers.get('content-type')};base64,`
        } : {};

        const enc = (workflow.b64ToImage) ? {
            encoding: 'base64'
        } : {};

        streamChain = [new base64Encode(dataUrl), fs.createWriteStream(workflow.destination, enc)];

    } else {

        streamChain = [fs.createWriteStream(workflow.destination)];

    }

    if (options.preserve && !workflow.detail.preserved && workflow.detail.altered) {
        dimensions = workflow.detail.width + 'x' + workflow.detail.height;
        workflow.detail.preserved = true;
        streamChain = [image.upscale(workflow.detail, ext), ...streamChain];
    }

    await pipeline(res.result.body, ...streamChain);

    let newName = await common.bumpIfExists(original);

    if (path.basename(original) === path.basename(newName)) {
        newName = original;
    }

    await rename(workflow.destination, newName);

    workflow.destination = newName;

    const end = process.hrtime(start);

    if (['file', 'base64'].includes(options.workflow) && options.deleteOriginal) {
        fs.unlink(options.source, () => {});
    }

    const outcome = {
        charged: Number(res.result.headers.get('x-credits-charged')),
        size: workflow.formData.size,
        duration: prettyHrtime(end),
        dimensions,
        detected: res.result.headers.get('x-type'),
        destination: workflow.destination
    };

    if (workflow.detail) {
        let resized = false;

        if (Number(res.result.headers.get('x-width')) < workflow.detail.width || Number(res.result.headers.get('x-height') < workflow.detail.height)) {
            resized = true;
        }

        outcome.resized = resized;

        outcome.preserved = workflow.detail.preserved;
    }

    return emit(progress, outcome);

}

module.exports = manage;
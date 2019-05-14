const fs = require('fs');
const util = require('util');
const path = require('path');
const sharp = require('sharp');
const roundTo = require('round-to');
const fetch = require('node-fetch');
const readChunk = require('read-chunk');
const validDataUrl = require('valid-data-url');

const statFile = util.promisify(fs.stat);

function getMinSize(currentSize, multi, bytes = 1024) {

    const marker = bytes * multi;

    const fullSize = currentSize || marker;

    const minSize = roundTo(fullSize * 0.01 / bytes, 0) * bytes;

    let size = (minSize > marker) ? minSize : marker;

    if (marker > fullSize) {
        size = fullSize;
    }

    return size;
}

const outcome = (promise) => {
    return promise
        .then(result => ({
            success: true,
            result
        }))
        .catch(error => ({
            success: false,
            error
        }));
};

async function stat(file) {
    const status = await outcome(statFile(file));

    if (!status.success) {
        return {
            error: status.error.message
        };
    }

    return status.result;
}

function isUtf8Representable(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        return false;
    }
    const utfEncodedBuffer = buffer.toString();
    const reconstructedBuffer = Buffer.from(utfEncodedBuffer, 'utf8');
    return !reconstructedBuffer.equals(buffer);
}

function url(source, multi, buffer = [], total = 0) {

    return new Promise(async (resolve) => {

        const res = await outcome(fetch(source));

        if (!res.success) {
            return resolve({
                error: res.error.message
            });
        }

        if (res.result.status !== 200) {
            return resolve({
                error: res.result.status + ' ' + res.result.statusText
            });
        }

        const size = getMinSize(Number(res.result.headers.get('content-length')), multi);

        res.result.body.on('data', chunk => {
            buffer.push(chunk);
            total = total + chunk.byteLength;
            if (total >= size) {
                res.result.body.end();
            }
        });

        res.result.body.on('end', () => {

            let mainBuffer = Buffer.concat(buffer, size);

            if (!isUtf8Representable(mainBuffer)) {
                mainBuffer = Buffer.from(mainBuffer.toString(), 'hex');
            }

            return resolve({
                size,
                source: mainBuffer
            });

        });

    });
}

async function content(options, ext = '', dataUrl = false, current = {}, chunks = null, target = '') {

    if (!options.multi) {
        options.multi = 10;
        options.retry = 1;
    }

    if (options.id === 'urlWorkflow') {
        target = options.source;
        const data = await url(options.source, options.multi);
        options = {
            ...options,
            ...data
        };
    }

    const isBuffer = Buffer.isBuffer(options.source);

    if (isBuffer) {
        current.size = options.source.byteLength;
    } else {
        current = await stat(options.source);
        if (current.error) {
            return current;
        }
        ext = path.extname(options.source);
    }

    const size = (!options.size) ? getMinSize(current.size, options.multi) : options.size;

    if (isBuffer) {
        chunks = Buffer.from(options.source, 0, size);
    } else {
        chunks = await readChunk(options.source, 0, size);
        if (ext === '.txt') {
            chunks = chunks.toString();
            dataUrl = validDataUrl(chunks);
            if (dataUrl) {
                chunks = (await readChunk(options.source, Buffer.from(chunks.split(',')[0] + ',').byteLength, size)).toString();
            }
        }
    }

    const details = await outcome(sharp(Buffer.from(chunks, 'base64')).metadata());

    if (!details.success) {
        if (details.error && details.error.message.includes('Input buffer has corrupt header') && options.retry <= 10) {
            if (options.id === 'urlWorkflow') {
                options.source = target;
            }
            return content({
                ...options,
                multi: options.multi * 2,
                retry: options.retry + 1
            });
        }
        return {
            error: details.error.message
        };
    }

    const {
        format,
        width,
        height,
        space,
        channels,
        depth,
        density,
        isProgressive,
        hasProfile,
        hasAlpha
    } = details.result;

    return {
        format,
        ext,
        dataUrl,
        width,
        height,
        space,
        channels,
        depth,
        density,
        isProgressive,
        hasProfile,
        hasAlpha
    };

}


module.exports = content;
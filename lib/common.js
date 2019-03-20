const fs = require('fs');
const util = require('util');
const path = require('path');
const fetch = require('node-fetch');
const imageType = require('image-type');
const sizeOf = require('image-size');
const shortid = require('shortid');
const Duplex = require('stream').Duplex;

const stat = util.promisify(fs.lstat);

const timeout = ms => new Promise(res => setTimeout(res, ms));

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@');

const filesSupport = ['.png', '.jpg', '.jpeg'];

const sizeSupport = [{
    name: 'regular',
    dim: '625×400',
    credits: 1,
    mpx: 0.25
}, {
    name: 'medium',
    dim: '1500×1000',
    credits: 3,
    mpx: 1.50
}, {
    name: 'hd',
    dim: '2500×1600',
    credits: 5,
    mpx: 4.00
}, {
    name: '4k',
    dim: '4000×2500',
    credits: 8,
    mpx: 10.00
}, {
    name: 'auto',
    dim: '',
    credits: -1,
    mpx: -1
}];

function check(options, size) {
    return options.some(item => (item.name || item).includes(size));
}

function supportedSizes(size) {
    return check(sizeSupport, size);
}

function supportedFiles(size, extra = []) {
    return check([...filesSupport, ...extra], size);
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

async function getDimensions(source) {
    let dim = {};

    try {
        dim = await sizeOf(source);
    } catch (e) {
        return {
            error: e.message
        };
    }

    const details = getImageDetails(dim);

    return {
        width: dim.width,
        height: dim.height,
        mpx: details.mpx,
        size: details.size
    };
}

function getImageDetails(dim) {
    const mpx = ((dim.width * dim.height) / 1000000).toFixed(2);

    let size = sizeSupport[0].name;

    if (mpx > sizeSupport[0].mpx) {
        size = sizeSupport[1].name;
    }

    if (mpx > sizeSupport[1].mpx) {
        size = sizeSupport[2].name;
    }

    if (mpx > sizeSupport[2].mpx) {
        size = sizeSupport[3].name;
    }

    return {
        width: dim.width,
        height: dim.height,
        mpx,
        size
    };
}

function isUtf8Representable(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        return false;
    }
    const utfEncodedBuffer = buffer.toString('utf8');
    const reconstructedBuffer = Buffer.from(utfEncodedBuffer, 'utf8');
    return !reconstructedBuffer.equals(buffer);
}

async function getDimensionsUrl(source) {

    const res = await outcome(fetch(source));

    if (!res.success) {
        return {
            error: res.error.message,
            source
        };
    }

    if (res.result.status !== 200) {
        const dump = await outcome(res.result.json());
        return {
            error: (!dump.success) ? res.result.statusText : dump.result.errors.shift().title,
            source
        };
    }

    let mainBuffer = await res.result.buffer();

    if (!isUtf8Representable(mainBuffer)) {
        mainBuffer = Buffer.from(mainBuffer.toString('utf8'), 'hex');
    }

    const image = imageType(mainBuffer);

    if (!image || !supportedFiles(`.${image.ext}`)) {
        return {
            error: 'Unsupported file format',
            source
        };
    }

    const dim = await getDimensions(mainBuffer);

    return getImageDetails(dim);

}

async function currentFile(source) {

    await timeout(Number(process.env.REMOVD_ISFILE_DELAY) || 200);

    const trackFile = await outcome(stat(source));

    if (trackFile.success && trackFile.result.isFile()) {
        return {
            exists: true,
            source
        };
    }

    if (trackFile.success && !trackFile.result.isFile()) {
        return {
            exists: false,
            source
        };
    }

    if (!trackFile.success && trackFile.error.code === 'ENOENT') {
        return {
            exists: false,
            source
        };
    }
}

async function bumpIfExists(file) {

    const fileStatus = await currentFile(file);

    if (!fileStatus.exists) {
        return file;
    }

    const item = path.parse(file);

    if (item.ext === '.txt') {
        return bumpIt(file, item.ext);
    }

    return bumpIt(file);
}

function bumpIt(file, ext) {
    const current = path.parse(file);
    return current.dir + `/${current.name}-${Array.from(shortid.generate()).slice(0, 9).join('')}${(ext) ? ext : `.png`}`;
}

function bufferToStream(buffer) {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

module.exports = {
    check,
    outcome,
    currentFile,
    bumpIfExists,
    sizeSupport,
    supportedFiles,
    supportedSizes,
    bufferToStream,
    getDimensions,
    isUtf8Representable,
    getDimensionsUrl,
    getImageDetails
};
const fs = require('fs');
const util = require('util');
const path = require('path');
const rgbHex = require('rgb-hex');
const hexRgb = require('hex-rgb');
const shortid = require('shortid');
const roundTo = require('round-to');
const fetch = require('node-fetch');
const sizeOf = require('image-size');
const imageType = require('image-type');
const colorNames = require('colornames');
const Duplex = require('stream').Duplex;

const stat = util.promisify(fs.lstat);

const timeout = ms => new Promise(res => setTimeout(res, ms));

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@');

const filesSupport = ['.png', '.jpg', '.jpeg'];

const typeSupport = ['auto', 'person', 'product'];

const chennelSupport = ['rgba', 'alpha'];

const formatSupport = ['auto', 'jpg', 'png'];

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

function supportedFiles(ext, extra = []) {
    return check([...filesSupport, ...extra], ext);
}

const supportOptions = {
    channels: (channel) => {
        return check(chennelSupport, channel);
    },
    detect: (type) => {
        return check(typeSupport, type);
    },
    size: (size) => {
        return check(sizeSupport, size);
    },
    format: (format) => {
        return check(formatSupport, format);
    },
    background: (color) => {
        const current = checkHexRgbaName(color);
        return (current.error) ? false : true;
    }
};

function supportedSizes(size) {
    return supportOptions.size(size);
}

function checkType(type) {
    let current = (type === 'detect') ? 'type' : type;
    return (current === 'background') ? 'bg_color' : current;
}

function support(formData, options, type) {

    if (!supportOptions[type]) {
        return {
            error: `Support option "${type}" not available`
        };
    }

    if (options[type] && !supportOptions[type](options[type])) {
        return {
            error: (type !== 'background') ? `Unsupported ${type} type` : checkHexRgbaName(options[type]).error
        };
    }

    if (options[type] && supportOptions[type](options[type]) && formData[checkType(type)] !== options[type]) {
        formData[checkType(type)] = options[type];
        if (type === 'background') {
            formData[checkType(type)] = checkHexRgbaName(options[type]).hex;
        }
    }

    return formData;
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

function validateHex(rgba) {

    rgba.alpha = (rgba.alpha !== 1) ? roundTo.up(rgba.alpha, 3) : rgba.alpha;
    const out = {
        channels: rgba,
        hex: rgbHex(Object.values(rgba).join(',')).replace('#', '')
    };
    return out;
}

function validateRgb(data) {
    const current = rgbHex(data).replace('#', '');
    const out = {
        channels: hexRgb(current),
        hex: rgbHex(data).replace('#', '')
    };
    out.channels.alpha = (out.channels.alpha !== 1) ? roundTo.up(out.channels.alpha, 3) : out.channels.alpha;
    return out;
}

function validateName(data) {
    const current = data.replace('#', '');
    return validateHex(hexRgb(current));
}

function checkHexRgbaName(rgba) {

    let hex = {};
    let channels = {};
    let validate = {};
    let names = {};

    try {
        hex.value = hexRgb(rgba);
        validate = validateHex(hex.value);
    } catch (e) {
        hex.error = e.message;
    }

    if (hex.error) {
        try {
            channels.value = rgbHex(rgba);
            validate = validateRgb(rgba);
        } catch (e) {
            channels.error = e.message;
        }
    }

    if (hex.error && channels.error && !channels.error.includes('as a fraction or percentage')) {
        const cn = colorNames(rgba);
        if (cn) {
            names.value = cn;
            validate = validateName(cn);
        } else {
            names.error = 'Invalid color name';
        }
    }

    if (validate.hex) {
        return validate;
    }

    const errors = [hex, channels, names].filter(item => item.error);

    return (!channels.error.includes('as a fraction or percentage')) ? errors.shift() : errors.pop();

}

module.exports = {
    check,
    support,
    outcome,
    currentFile,
    bumpIfExists,
    bufferToStream,
    getDimensions,
    supportedFiles,
    supportedSizes,
    isUtf8Representable,
    getDimensionsUrl,
    getImageDetails
};
const fs = require('fs');
const util = require('util');
const path = require('path');
const rgbHex = require('rgb-hex');
const hexRgb = require('hex-rgb');
const shortid = require('shortid');
const roundTo = require('round-to');
const colorNames = require('colornames');
const mergeStreams = require('merge2');
const stream = require('stream');
const content = require('./content');

const stat = util.promisify(fs.lstat);

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@');

const filesSupport = ['.png', '.jpg', '.jpeg'];

const typeSupport = ['auto', 'person', 'product', 'car'];

const chennelSupport = ['rgba', 'alpha'];

const formatSupport = ['auto', 'jpg', 'png'];

const sizeSupport = [{
    name: 'small',
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

function check(options, size) {
    return options.some(item => (item.name || item).includes(size));
}

function supportedFiles(ext, extra = []) {
    return check([...filesSupport, ...extra], ext);
}

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

async function getDimensions(source, id) {

    const dim = await content({
        source,
        id
    });

    if (!dim.format || !supportedFiles(dim.format) || (dim.error && dim.error.includes('unsupported image format'))) {
        return {
            error: 'Unsupported file format'
        };
    }

    if (dim.error) {
        return dim;
    }

    if (id === 'fileWorkflow' && dim.ext === '.txt') {
        return {
            error: 'Unsupported file format'
        };
    }

    return getImageDetails(dim);

}

function calculateARFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
        width: roundTo(srcWidth * ratio, 0),
        height: roundTo(srcHeight * ratio, 0)
    };
}

function getImageDetails(dim) {

    const mpx = roundTo((dim.width * dim.height) / 1000000, 2);

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

    const max = sizeSupport.filter(item => item.name === size).shift().dim.split('×');

    const ar = roundTo(dim.width / dim.height, 2);

    if (ar < 1) {
        max.push(max[0]);
        max.shift();
    }

    const preserve = calculateARFit(dim.width, dim.height, max[0], max[1]);

    const preserved = ((dim.width <= preserve.width) || (dim.height <= preserve.height)) ? true : false;

    return {
        width: dim.width,
        height: dim.height,
        maxWidth: preserve.width,
        maxHeight: preserve.height,
        dataUrl: dim.dataUrl,
        format: dim.format,
        ext: dim.ext,
        space: dim.space,
        size,
        ar,
        mpx,
        preserved
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

async function currentFile(source) {

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

function toStream(data) {
    const streamFlow = new stream.Readable();
    streamFlow.push(data);
    streamFlow.push(null);
    return streamFlow;
}

function stripDataUriStream(dataUri, stripped = false, total = 0) {
    return new stream.Transform({
        transform(chunk, encoding, callback) {
            if (encoding === 'buffer') {
                if (!dataUri) {
                    return callback(null, chunk);
                }
                if (total < 30 && !stripped) {
                    if (chunk.includes(',')) {
                        chunk = chunk.slice(chunk.indexOf(',') + 1, chunk.byteLength);
                        stripped = true;
                    } else {
                        chunk = Buffer.from('');
                    }
                }
                total = total + chunk.byteLength;
                callback(null, chunk);
            }
        }
    });
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

function combineStreams(options) {
    const current = '",' + JSON.stringify((({
        source,
        ...others
    }) => ({
        ...others
    }))(options)).slice(1);

    const type = Object.keys(options.source).shift();

    return mergeStreams(toStream(`{"${type}":"`), Object.values(options.source).shift(), toStream(current));
}

module.exports = {
    check,
    support,
    outcome,
    toStream,
    currentFile,
    bumpIfExists,
    getDimensions,
    supportedFiles,
    supportedSizes,
    combineStreams,
    isUtf8Representable,
    stripDataUriStream,
    getImageDetails
};
const pkg = require('../package');

const api = {
    endpoint: 'https://api.remove.bg/v1.0',
    ua: {
        'User-Agent': `${pkg.name}/${pkg.version} (+${pkg.homepage})`
    },
    filesSupport: ['.png', '.jpg', '.jpeg'],
    typeSupport: ['auto', 'person', 'product', 'car'],
    chennelSupport: ['rgba', 'alpha'],
    formatSupport: ['auto', 'jpg', 'png'],
    sizeSupport: [{
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
    }]
};

module.exports = api;
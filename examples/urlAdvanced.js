const removd = require('../removd');

(async () => {

    const done = await removd.url({
        size: 'regular',
        detect: 'person',
        channels: 'alpha',
        background: '81d4fa77',
        destination: '/outcome/',
        source: [
            'https://images.unsplash.com/photo-1520853504280-249b72dc947c?w=1500&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80'
        ]
    });

    console.dir(done);

})();
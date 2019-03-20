const removd = require('../removd');

(async () => {

    const done = await removd.url({
        destination: '/outcome/',
        source: 'https://images.unsplash.com/photo-1520853504280-249b72dc947c?1500&q=80'
    });

    console.dir(done);

})();
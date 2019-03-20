const removd = require('../removd');

(async () => {

    const done = await removd.url({
        destination: '/outcome/',
        source: [
            'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?w=400&q=80',
            'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?w=1500&q=80'
        ]
    });

    console.dir(done);

})();
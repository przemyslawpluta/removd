const removd = require('../removd');

(async () => {

    const done = await removd.file({
        size: 'auto',
        destination: '/outcome/',
        source: [
            '/directory/christopher-campbell-28567-unsplash-400x267.jpg',
            '/directory/christopher-campbell-28567-unsplash-1500x1000.jpg',
            '/directory/christopher-campbell-28567-unsplash-2400x1600.jpg'
        ]
    });

    console.dir(done);

})();
const removd = require('../removd');

(async () => {

    const done = await removd.base64({
        size: 'hd',
        glob: true,
        toImage: true,
        destination: '/outcome/',
        source: [
            '/directory/christopher-campbell-28567-unsplash-400x267.jpg',
            '/secondary-directory/christopher-campbell-28567-unsplash-1500x1000.jpg',
            '/directory/*.txt'
        ]
    });

    console.dir(done);

})();
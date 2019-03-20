const removd = require('../removd');

(async () => {

    const done = await removd.file({
        glob: true,
        destination: '/outcome/',
        source: [
            '/main_directory/*.jpg',
            '/secondary_directory/christopher-campbell-28567-unsplash-1500x1000.jpg',
            '/secondary_directory/christopher-campbell-28567-unsplash-400x267.jpg',
            '/directory/*.png'
        ]
    });

    console.dir(done);

})();
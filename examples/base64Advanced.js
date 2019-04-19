const removd = require('../removd');

(async () => {

    const done = await removd.base64({
        size: 'hd',
        toImage: true,
        detect: 'person',
        background: '81d4fa77',
        source: [
            '/directory/christopher-campbell-28567-unsplash-400x267.jpg',
            '/secondary-directory/christopher-campbell-28567-unsplash-1500x1000-url.txt'
        ]
    });

    console.log(done);

})();
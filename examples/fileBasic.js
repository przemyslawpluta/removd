const removd = require('../removd');

(async () => {

    const done = await removd.file({
        source: '/directory/christopher-campbell-28567-unsplash-400x267.jpg'
    });

    console.dir(done);

})();
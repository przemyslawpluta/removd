const removd = require('../removd');

(async () => {

    const done = await removd.base64({
        source: '/directory/christopher-campbell-28567-unsplash-400x267.txt'
    });

    console.log(done);

})();
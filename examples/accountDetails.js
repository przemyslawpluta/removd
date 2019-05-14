const removd = require('../removd');

(async () => {

    const done = await removd.account();

    console.dir(done);

})();
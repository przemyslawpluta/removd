const removd = require('../removd');

(async () => {

    const batch = await removd.file({
        glob: true,
        preserve: true,
        progress: true,
        source: [
            '/directory/*.jpg'
        ]
    });

    const files = batch.files;

    console.dir(files);

    batch.progress.on('item', item => {
        console.dir(item);
    });

    const list = await batch.init();

    console.dir(list);

})();
const removd = require('../removd');

(async () => {

    const batch = await removd.base64({
        glob: true,
        toImage: true,
        progress: true,
        source: [
            '/directory/*.txt'
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
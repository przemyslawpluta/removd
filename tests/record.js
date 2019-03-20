const fs = require('fs');
const nock = require('nock');
const path = require('path');

function mkdirSync(pathname) {

    if (fs.existsSync(pathname)) {
        return;
    }

    const parent = path.dirname(pathname);

    if (fs.existsSync(parent)) {
        fs.mkdirSync(pathname);
    } else {
        mkdirSync(parent);
        fs.mkdirSync(pathname);
    }
}

module.exports = (name, options) => {
    options = options || {};
    const test_folder = options.test_folder || 'tests';
    const fixtures_folder = options.fixtures_folder || 'fixtures';

    mkdirSync(path.resolve(test_folder, '..', fixtures_folder));

    const fp = path.resolve(test_folder, '..', fixtures_folder, name + '.js');
    let has_fixtures = (process.env.NOCK_RECORD === 'true') ? true : false;

    return {
        before: () => {
            if (!has_fixtures) try {
                require(fp);
                has_fixtures = true;
            } catch (e) {
                nock.recorder.rec({
                    dont_print: true
                });
            } else {
                has_fixtures = false;
                nock.recorder.rec({
                    dont_print: true
                });
            }
        },

        after: (done) => {
            if (!has_fixtures) {
                const fixtures = nock.recorder.play();
                const text = "const nock = require('nock');\nnock.disableNetConnect();\n" + fixtures.join('\n');
                fs.writeFile(fp, text, done);
            } else {
                done();
            }
        }
    };
};
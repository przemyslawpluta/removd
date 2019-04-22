const fileWorkflow = require('../workflows/file');
const urlWorkflow = require('../workflows/url');
const base64Workflow = require('../workflows/base64');

async function selectWorkflow(options) {
    const current = [fileWorkflow, urlWorkflow, base64Workflow].reduce((out, item) => {
        if (item.name.indexOf(options.workflow) === 0) {
            out.push(item);
        }
        return out;
    }, []).shift();

    if (!current) {
        return {
            error: 'Valid worklfow required'
        };
    }

    return await current(options);
}

module.exports = selectWorkflow;
const path = require('path');
const expect = require('chai').expect;
const record = require('./record');
const removd = require('../removd');

describe('# account workflow', () => {

    const recorder = record(path.parse(__filename).name);

    before(recorder.before);

    context('with correct details', () => {

        let done = {};

        it('should return credits and api details', async () => {
            done = await removd.account();
            expect(done).to.be.an('object');
        });

        it('credits should return total, subscription and pay as you go details', () => {
            expect(done).to.have.own.property('credits');
            expect(done.credits).to.deep.equal({
                total: 200,
                subscription: 150,
                payg: 50
            });
        });

        it('api should return free_calls and sizes', () => {
            expect(done).to.have.own.property('api');
            expect(done.api).to.deep.equal({
                free_calls: 50,
                sizes: 'all'
            });
        });
    });

    after(recorder.after);

});
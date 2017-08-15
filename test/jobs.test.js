'use strict';

const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

sinon.assert.expose(assert, { prefix: '' });

describe('Jobs Unit Test', () => {
    let mockExecutor;
    let mockExecutorRouter;
    let jobs;

    before(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach(() => {
        mockExecutor = {
            start: sinon.stub()
        };

        mockExecutorRouter = function () { return mockExecutor; };

        mockery.registerMock('screwdriver-executor-router', mockExecutorRouter);

        // eslint-disable-next-line global-require
        jobs = require('../lib/jobs');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.resetCache();
    });

    after(() => {
        mockery.disable();
    });

    describe('start', () => {
        it('starts a job', (done) => {
            const expectedConfig = { buildConfig: 'buildConfig' };

            mockExecutor.start.resolves(null);

            jobs.start(expectedConfig, (err, result) => {
                assert.isNull(err);
                assert.isNull(result);

                assert.calledWith(mockExecutor.start, expectedConfig);

                done();
            });
        });

        it('returns an error from executor', (done) => {
            const expectedError = new Error('executor.start Error');

            mockExecutor.start.rejects(expectedError);

            jobs.start({}, (err) => {
                assert.deepEqual(err, expectedError);

                done();
            });
        });
    });
});

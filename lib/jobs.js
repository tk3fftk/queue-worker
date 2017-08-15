'use strict';

const config = require('config');

const ecosystem = config.get('ecosystem');
const executorConfig = config.get('executor');
const executorPlugins = Object.keys(executorConfig).reduce((aggregator, keyName) => {
    if (keyName !== 'plugin') {
        aggregator.push(Object.assign({
            name: keyName
        }, executorConfig[keyName]));
    }

    return aggregator;
}, []);

const ExecutorRouter = require('screwdriver-executor-router');
const executor = new ExecutorRouter({
    defaultPlugin: executorConfig.plugin,
    executor: executorPlugins,
    ecosystem
});

/**
 * Call executor.start with the buildConfig
 * @method start
 * @param {Object}    buildConfig               Configuration object
 * @param {Object}    [buildConfig.annotations] Optional key-value object
 * @param {String}    buildConfig.apiUri        URI for Screwdriver API
 * @param {String}    buildConfig.buildId       Unique ID for a build
 * @param {String}    buildConfig.container     Container for the build to run int
 * @param {String}    buildConfig.token         JWT to act on behalf of the build
 * @param {Function}  callback                  Callback fn(error, result)
 */
function start(buildConfig, callback) {
    return executor.start(buildConfig)
        .then(result => callback(null, result), err => callback(err));
}

/**
 * Call executor.stop with the buildConfig
 * @method stop
 * @param {Object}     buildConfig          Configuration object
 * @param {String}     buildConfig.buildId  Unique ID for a build
 * @param {Function }  callback             Callback fn(error, result)
 */
function stop(buildConfig, callback) {
    return executor.stop(buildConfig)
        .then(result => callback(null, result), err => callback(err));
}

module.exports = {
    start,
    stop
};

'use strict';

const pathFromIndex = require('./path-from-index');

module.exports = function requireFromIndex(...modulePath) {
	return require(pathFromIndex(...modulePath));
}
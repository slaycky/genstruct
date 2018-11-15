'use strict';

const sinon = require('sinon');

module.exports = function mockWriteFile() {
	return sinon.spy((filePath, content, options, cb) => cb());
}
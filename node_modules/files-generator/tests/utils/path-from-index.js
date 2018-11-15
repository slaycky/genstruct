'use strict';

const path = require('path');

module.exports = function pathFromIndex(...modulePath) {
	return path.join(__dirname, '../..', ...modulePath);
}
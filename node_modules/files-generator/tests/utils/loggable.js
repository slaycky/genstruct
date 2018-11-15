'use strict';

module.exports = function loggable(value) {
	return typeof value === 'symbol' ? value.toString() : value;
}
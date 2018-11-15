'use strict';

/**
 * @description takes strings as parameters, join them with a space and returns the result.
 *
 * @param {...string} strings - The strings to join
 *
 * @returns {string} the joined strings
 */
function msg(...strings) {
	return strings.map(s => s.trim()).join(' ');
};

module.exports = msg;
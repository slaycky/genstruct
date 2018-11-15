'use strict';

const dashify = require('dashify');

const createTestDirectory = require('../../utils/create-test-directory');

function testDirectoryMacro(t, core) {
	createTestDirectory({
		title: dashify(t.title),
		template: 'must-be-preserved',
		ava_t: t
	}, directory => {
		core(t, directory);
	});
}

module.exports = testDirectoryMacro;
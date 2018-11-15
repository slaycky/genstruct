'use strict';

const mockWriteFileDefaultOptions = require('../../mocks/mock-write-file-default-options');

function writeFileCallExpectOptionsMacro(t, writeFile, call, expectedOptions){
	const options = writeFile.getCall(call).args[2];
	expectedOptions = Object.assign({}, mockWriteFileDefaultOptions, expectedOptions);

	t.is(options.encoding, expectedOptions.encoding);
}

module.exports = writeFileCallExpectOptionsMacro;
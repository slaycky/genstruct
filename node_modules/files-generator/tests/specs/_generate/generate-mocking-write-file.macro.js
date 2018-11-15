'use strict';

const requireFromIndex = require('../../utils/require-from-index');

const mockWriteFile = require('../../mocks/mock-write-file');

function generateMockingWriteFileMacro(t, core) {
	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		writeFile
	});

	core(t, writeFile, generate);
}

module.exports = generateMockingWriteFileMacro;
'use strict';

let fileNameCount = 0;
function mockGenerateConfigObjectKeyName({
	depth = (fileNameCount++),
	directory = false,
	absolute = false
} = {}){
	const ext = directory === 'directory' ? '' : '.txt';
	const absoluteMark = absolute ? absolute : '';

	fileNameCount++;

	if (depth % 3 === 0) {
		return `${absoluteMark}mock-folder-name-${fileNameCount}/mock-subfolder-name-${fileNameCount}/mock-file-name-${fileNameCount}${ext}`;
	}

	if (depth % 2 === 0) {
		return `${absoluteMark}mock-folder-name-${fileNameCount}/mock-file-name-${fileNameCount}${ext}`;
	}

	return `${absoluteMark}mock-file-name-${fileNameCount}${ext}`;
}

module.exports = mockGenerateConfigObjectKeyName;
'use strict';

const fs = require('fs');
const path = require('path');

const test = require('ava');
const glob = require('glob');

const pathFromIndex = require('./utils/path-from-index');

test('ensure all files are tested', t => {
	function sourcesPath(...modulePath) {
		return pathFromIndex('sources', ...modulePath);
	}

	return new Promise((resolve, reject) => {
		glob(sourcesPath('/**/*.js'), (err, fileList) => {
			if (err) {reject(err);return;}

			if (fileList.length === 0) {
				reject(new Error('No file to test'));return;
			}

			Promise.all(fileList.map(filePath => filePath.replace(sourcesPath(), '')).map(fileToTest => new Promise((resolve) => {
				const dirname = path.dirname(fileToTest);
				const basename = path.basename(fileToTest, path.extname(fileToTest));
				const testFile = path.join(dirname, `${basename}.test.js`);

				fs.access(pathFromIndex('tests/specs', testFile), err => {
					if (err) {t.fail(`${fileToTest} has no existing test file (${err.message})`);}
					resolve();
				});
			}))).then(()=>{
				t.pass();
				resolve();
			});
		});
	});
});
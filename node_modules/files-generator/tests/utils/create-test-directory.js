'use strict';

const fs = require('fs');
const path = require('path');

const assert = require('better-assert');
const temp = require('temp');
const copy = require('recursive-copy');
const glob = require('glob');

const assertAllFilesExist = require('./assert-all-files-exist');

temp.track();

module.exports = function createTestDirectory({
	title,
	template = null,
	ava_t = null
}, createTestDirectoryCallback) {
	assert(typeof title === 'string' && title.length >= 2);
	assert(!template || (typeof template === 'string' && template.length >= 2));

	temp.mkdir(title, (err, absolutePath)=>{
		if (err) {throw err;}

		function createTestDirectoryCallbackRun() {
			const directory = {
				path: absolutePath,
				filesList(cb){
					glob(path.join(absolutePath, '**/*'), (err, files) => {
						if (err) {return cb(err, null);}
						const filesList = [];

						Promise.all(files.map(file => new Promise((resolve, reject)=>{
							fs.readFile(file, {encoding: 'utf-8'}, (err, content) => {
								if (err) {return reject(err);}

								filesList.push({
									path: path.relative(absolutePath, file),
									content
								});

								resolve();
							});
						}))).then(()=>{
							cb(null, filesList);
						}).catch(err => {
							cb(err, null);
						});
					});
				},
				assertAllFilesExist (expectedFiles, cb){
					assert(Array.isArray(expectedFiles));

					assertAllFilesExist(expectedFiles.map(file => ({
						path: path.isAbsolute(file.path) ? file.path : path.join(absolutePath, file.path),
						content: file.content,
						encoding: file.encoding
					})), cb, {
						ava_t
					});
				},
			};

			directory.filesList((err, initialFilesList) => {
				if (err) {
					throw err;
				}

				directory.initialFilesList = initialFilesList;
				createTestDirectoryCallback(directory);
			});
		}

		if (template) {
			const templatePath = path.join(__dirname, `test-directory-templates/${template}`);

			copy(templatePath, absolutePath, err => {
				if (err) {throw err;}

				createTestDirectoryCallbackRun();
			});
		}
		else{
			createTestDirectoryCallbackRun();
		}
	});
}
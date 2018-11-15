'use strict';

const test = require('ava');
const sinon = require('sinon');

const path = require('path');

const requireFromIndex = require('../../utils/require-from-index');

const testDirectoryMacro = require('./test-directory.macro');

const mockWriteFileDefaultOptions = require('../../mocks/mock-write-file-default-options');
const mockGenerateConfigObjectKeyName = require('../../mocks/mock-generate-config-object-key-name');
const mockFileContent = require('../../mocks/mock-file-content');
const mockWriteFile = require('../../mocks/mock-write-file');

const generateMockingWriteFileMacro = require('./generate-mocking-write-file.macro');
const writeFileCallExpectOptionsMacro = require('./write-file-call-expect-options.macro');

/*-------------------*/
/*----- Encoding ----*/
/*-------------------*/

test.cb('default encoding', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent,
			encoding: mockWriteFileDefaultOptions.encoding
		}], ()=>{
			t.end();
		});
	});
});

test.cb('override encoding using the instance generator', testDirectoryMacro, (t, directory) => {
	const encoding = 'latin1';

	const generate = requireFromIndex('sources/generate')({
		encoding
	});

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent,
			encoding
		}], ()=>{
			t.end();
		});
	});
});

test.cb('override encoding using the generate function', testDirectoryMacro, (t, directory) => {
	const encoding = 'latin1';

	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		encoding
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent,
			encoding
		}], ()=>{
			t.end();
		});
	});
});

test.cb('override encoding using the generate function after using the instance generator', testDirectoryMacro, (t, directory) => {
	const encoding = 'latin1';

	const generate = requireFromIndex('sources/generate')({
		encoding: 'utf-8'
	});

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		encoding
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent,
			encoding
		}], ()=>{
			t.end();
		});
	});
});

test.cb('generate.use() simple string as content - override encoding', generateMockingWriteFileMacro, (t, writeFile, generate) => {
	const encoding = 'latin1';

	const filePath1 = mockGenerateConfigObjectKeyName({ absolute:'/' });
	const fileContent1 = mockFileContent();
	const filePath2 = mockGenerateConfigObjectKeyName({ absolute:'/' });
	const fileContent2 = mockFileContent();

	generate({
		[filePath1]: generate.use(fileContent1),
		[filePath2]: generate.use(fileContent2, {encoding})
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.is(writeFile.callCount, 2);
		t.true(writeFile.withArgs(filePath1, fileContent1).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, {});

		t.true(writeFile.withArgs(filePath2, fileContent2).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 1, { encoding });

		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath1, filePath2]
		});

		t.true(writeListener.calledTwice);

		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath1
		});

		const call1 = writeListener.getCall(1).args;
		t.is(call1.length, 1);
		const event1 = call1[0];
		t.deepEqual(event1, {
			data: undefined,
			filepath: filePath2
		});

		t.end();
	});
});

/*---------------*/
/*----- cwd -----*/
/*---------------*/

test.cb('default cwd', generateMockingWriteFileMacro, (t, writeFile, generate) => {
	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const expectedPath = path.join(mockWriteFileDefaultOptions.cwd, filePath);
	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [expectedPath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: expectedPath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(expectedPath, fileContent).calledOnce);

		t.end();
	});
});

test.cb('override cwd using the instance generator', t => {
	const cwd = '/cwd/override';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		cwd,
		writeFile
	});

	const filePath = mockGenerateConfigObjectKeyName();
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const expectedPath = path.join(cwd, filePath);
	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [expectedPath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: expectedPath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(expectedPath, fileContent).calledOnce);

		t.end();
	});
});

test.cb('override cwd using the generate function', t => {
	const cwd = '/cwd/override';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName();
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		cwd,
		writeFile
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const expectedPath = path.join(cwd, filePath);
	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [expectedPath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: expectedPath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(expectedPath, fileContent).calledOnce);

		t.end();
	});
});

test.cb('override cwd using the generate function after using the instance generator', t => {
	const cwd = '/cwd/override';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		cwd: '/other/cwd/override'
	});

	const filePath = mockGenerateConfigObjectKeyName();
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		cwd,
		writeFile
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const expectedPath = path.join(cwd, filePath);
	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [expectedPath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: expectedPath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(expectedPath, fileContent).calledOnce);

		t.end();
	});
});

test.cb('generate.use() simple string as content - override cwd', generateMockingWriteFileMacro, (t, writeFile, generate) => {
	const cwd = '/cwd/override';

	const filePath = mockGenerateConfigObjectKeyName();
	const fileContent = mockFileContent();

	generate({
		[filePath]: generate.use(fileContent, {cwd}),
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const expectedPath = path.join(cwd, filePath);
	generate.on('finish', event => {
		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(expectedPath, fileContent).calledOnce);

		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [expectedPath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: expectedPath
		});

		t.end();
	});
});

/*--------------------*/
/*----- writeFile ----*/
/*--------------------*/

test.cb('override writeFile function using the instance generator', testDirectoryMacro, (t, directory) => {
	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		writeFile
	});

	const filePath = mockGenerateConfigObjectKeyName({
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);
		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: false
		}], ()=>{
			t.end();
		});
	});
});

test.cb('override writeFile function using the generate function', testDirectoryMacro, (t, directory) => {
	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName({
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		writeFile
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);
		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: false
		}], ()=>{
			t.end();
		});
	});
});

test.cb('override writeFile function using the instance generator - default options', t => {
	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		writeFile
	});

	const filePath = mockGenerateConfigObjectKeyName({ absolute: '/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, {});

		t.end();
	});
});

test.cb('override writeFile function using the generate function - default options', t => {
	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName({ absolute: '/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		writeFile
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, {});

		t.end();
	});
});

test.cb('generate.use() simple string as content - override writeFile', generateMockingWriteFileMacro, (t, writeFile, generate) => {
	const writeFileBis = mockWriteFile();

	const filePath1 = mockGenerateConfigObjectKeyName({ absolute:'/' });
	const fileContent1 = mockFileContent();
	const filePath2 = mockGenerateConfigObjectKeyName({ absolute:'/' });
	const fileContent2 = mockFileContent();

	generate({
		[filePath1]: generate.use(fileContent1),
		[filePath2]: generate.use(fileContent2, {writeFile: writeFileBis})
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.true(writeFile.calledOnce);
		t.true(writeFileBis.calledOnce);
		t.true(writeFile.withArgs(filePath1, fileContent1).calledOnce);
		t.true(writeFileBis.withArgs(filePath2, fileContent2).calledOnce);

		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath1, filePath2]
		});

		t.true(writeListener.calledTwice);

		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath1
		});

		const call1 = writeListener.getCall(1).args;
		t.is(call1.length, 1);
		const event1 = call1[0];
		t.deepEqual(event1, {
			data: undefined,
			filepath: filePath2
		});

		t.end();
	});
});

/*--------------------------------*/
/*----- writeFile && encoding ----*/
/*--------------------------------*/

test.cb('override writeFile function using the instance generator - encoding options', t => {
	const encoding = 'latin1';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		writeFile,
		encoding
	});

	const filePath = mockGenerateConfigObjectKeyName({ absolute: '/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, { encoding });

		t.end();
	});
});

test.cb('override writeFile function using the instance generator - encoding options in the generate function', t => {
	const encoding = 'latin1';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		writeFile
	});

	const filePath = mockGenerateConfigObjectKeyName({ absolute : '/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, { encoding });

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, { encoding });

		t.end();
	});
});

test.cb('override writeFile function using the generate function - encoding option', t => {
	const encoding = 'latin1';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName({ absolute: '/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		writeFile,
		encoding
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, { encoding });

		t.end();
	});
});

test.cb('override writeFile function using the generate function - encoding option in the instance generator', t => {
	const encoding = 'latin1';

	const writeFile = mockWriteFile();
	const generate = requireFromIndex('sources/generate')({
		encoding
	});

	const filePath = mockGenerateConfigObjectKeyName({ absolute: '/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		writeFile
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: filePath
		});

		t.true(writeFile.calledOnce);

		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, { encoding });

		t.end();
	});
});

/*--------------------*/
/*----- rootPath -----*/
/*--------------------*/

test.todo('override rootPath option using the instance generator');
test.todo('override rootPath option using the generate function');
test.todo('override rootPath option using the generate function after using the instance generator');
test.todo('generate.use() simple string as content - rootPath option');

/*---------------------------*/
/*----- rootPath && cwd -----*/
/*---------------------------*/

test.todo('override rootPath and cwd options');

/*-------------------*/
/*-------------------*/
/*-------------------*/

test.todo('generate options - override');
test.todo('generate options - backupStrategy');
test.todo('generate options - backupStrategyOptions');

/*-------------------*/
/*-------------------*/
/*-------------------*/

test.cb('generate.use() simple string as content - override all the options', generateMockingWriteFileMacro, (t, writeFile, generate) => {
	const encoding = 'latin1';
	const cwd = '/cwd/override';

	const writeFile2 = mockWriteFile();
	const filePath = mockGenerateConfigObjectKeyName();
	const fileContent = mockFileContent();

	generate({
		[filePath]: generate.use(fileContent, {
			writeFile: writeFile2,
			encoding,
			cwd
		}),
	});

	generate.on('error', ()=>t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const expectedPath = path.join(cwd, filePath);
	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [expectedPath]
		});

		t.true(writeListener.calledOnce);
		const call0 = writeListener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.deepEqual(event0, {
			data: undefined,
			filepath: expectedPath
		});

		t.true(writeFile.notCalled);
		t.true(writeFile2.calledOnce);

		t.true(writeFile2.withArgs(expectedPath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile2, 0, { encoding });

		t.end();
	});
});
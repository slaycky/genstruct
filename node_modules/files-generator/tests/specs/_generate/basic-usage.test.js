'use strict';

const test = require('ava');

const sinon = require('sinon');

const requireFromIndex = require('../../utils/require-from-index');

const testDirectoryMacro = require('./test-directory.macro');

const mockGenerateConfigObjectKeyName = require('../../mocks/mock-generate-config-object-key-name');
const mockFileContent = require('../../mocks/mock-file-content');

const generateMockingWriteFileMacro = require('./generate-mocking-write-file.macro');
const writeFileCallExpectOptionsMacro = require('./write-file-call-expect-options.macro');

/*----------------------------------*/

test('create new generate function', t => {
	const generate = requireFromIndex('sources/generate')();

	t.is(typeof generate, 'function');
});

test('generate instance function returns null', t => {
	const generate = requireFromIndex('sources/generate')();

	const generateResult = generate();

	t.is(generateResult, undefined);
});

/*----------------------------------*/

test.cb('generate a file from a simple string content', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	t.plan(5);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', () => t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event=>{
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.true(writeListener.calledOnce);
		const writeArgs = writeListener.getCall(0).args;
		t.is(writeArgs.length, 1);
		t.deepEqual(writeArgs[0], {
			data: undefined,
			filepath: filePath
		});

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.pass();
			t.end();
		});
	});
});

test.cb('generate files from a simple string content to a non-existent paths', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	t.plan(7);

	const filePath1 = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});
	const fileContent1 = mockFileContent();

	const filePath2 = mockGenerateConfigObjectKeyName({
		depth: 3,
		absolute: directory.path
	});
	const fileContent2 = mockFileContent();

	generate({
		[filePath1]: fileContent1,
		[filePath2]: fileContent2
	});

	generate.on('error', () => t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event=>{
		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath1, filePath2]
		});

		t.true(writeListener.calledTwice);
		const writeArgs1 = writeListener.getCall(0).args;
		t.is(writeArgs1.length, 1);
		t.deepEqual(writeArgs1[0], {
			data: undefined,
			filepath: filePath1
		});

		const writeArgs2 = writeListener.getCall(1).args;
		t.is(writeArgs2.length, 1);
		t.deepEqual(writeArgs2[0], {
			data: undefined,
			filepath: filePath2
		});

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath1,
			content: fileContent1
		}, {
			path: filePath2,
			content: fileContent2
		}], ()=>{
			t.pass();
			t.end();
		});
	});
});

test.cb('generate.use() simple string as content', generateMockingWriteFileMacro, (t, writeFile, generate) => {

	const filePath = mockGenerateConfigObjectKeyName({ absolute:'/' });
	const fileContent = mockFileContent();

	generate({
		[filePath]: generate.use(fileContent)
	});

	generate.on('error', () => t.fail());

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	generate.on('finish', event=>{
		t.true(writeFile.calledOnce);
		t.true(writeFile.withArgs(filePath, fileContent).calledOnce);
		writeFileCallExpectOptionsMacro(t, writeFile, 0, {});

		t.true(writeListener.calledOnce);
		const writeArgs = writeListener.getCall(0).args;
		t.is(writeArgs.length, 1);
		t.deepEqual(writeArgs[0], {
			data: undefined,
			filepath: filePath
		});

		t.deepEqual(event, {
			data: undefined,
			errors: [],
			success: [filePath]
		});

		t.end();
	});
});

/*------------------*/

test.cb('trying to use unhandled content type', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	generate({
		[filePath]: 42
	});

	generate.on('write', ()=>t.fail());

	const errorListener = sinon.spy();
	generate.on('error', errorListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [filePath],
			success: []
		});

		t.true(errorListener.calledOnce);
		const errorArgs = errorListener.getCall(0).args;
		t.is(errorArgs.length, 1);
		const errorEvent = errorArgs[0];
		t.deepEqual(Object.keys(errorEvent).sort(), ['data', 'error', 'filepath']);
		t.is(errorEvent.data, undefined);
		t.is(errorEvent.filepath, filePath)
		t.true(errorEvent.error instanceof Error);
		t.is(errorEvent.error.message, `File content of type "number" is not a content type handled by files-generator.`);

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: false
		}], ()=>{
			t.end();
		});
	});
});

test.cb('trying to use unhandled content type - multiple files writing', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePath1 = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});
	const fileContent1 = mockFileContent();

	const filePath2 = mockGenerateConfigObjectKeyName({
		depth: 3,
		absolute: directory.path
	});
	const fileContent2 = mockFileContent();

	const filePathError1 = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathError2 = mockGenerateConfigObjectKeyName({
		depth: 3,
		absolute: directory.path
	});

	generate({
		[filePath1]: fileContent1,
		[filePathError1]: {},
		[filePath2]: fileContent2,
		[filePathError2]: ()=>{return},
	});

	const writeListener = sinon.spy();
	generate.on('write', writeListener);

	const errorListener = sinon.spy();
	generate.on('error', errorListener);

	generate.on('finish', event => {
		t.deepEqual(event, {
			data: undefined,
			errors: [filePathError1, filePathError2],
			success: [filePath1, filePath2]
		});

		t.true(writeListener.calledTwice);
		const writeArgs1 = writeListener.getCall(0).args;
		t.is(writeArgs1.length, 1);
		const writeEvent1 = writeArgs1[0];
		t.deepEqual(Object.keys(writeEvent1).sort(), ['data', 'filepath']);
		t.is(writeEvent1.data, undefined);
		t.is(writeEvent1.filepath, filePath1);

		const writeArgs2 = writeListener.getCall(1).args;
		t.is(writeArgs2.length, 1);
		const writeEvent2 = writeArgs2[0];
		t.deepEqual(Object.keys(writeEvent2).sort(), ['data', 'filepath']);
		t.is(writeEvent2.data, undefined);
		t.is(writeEvent2.filepath, filePath2);

		t.true(errorListener.calledTwice);
		const errorArgs1 = errorListener.getCall(0).args;
		t.is(errorArgs1.length, 1);
		const errorEvent1 = errorArgs1[0];
		t.deepEqual(Object.keys(errorEvent1).sort(), ['data', 'error', 'filepath']);
		t.is(errorEvent1.data, undefined);
		t.is(errorEvent1.filepath, filePathError1);
		t.true(errorEvent1.error instanceof Error);
		t.is(errorEvent1.error.message, `File content of type "object" is not a content type handled by files-generator.`);

		const errorArgs2 = errorListener.getCall(1).args;
		t.is(errorArgs2.length, 1);
		const errorEvent2 = errorArgs2[0];
		t.deepEqual(Object.keys(errorEvent2).sort(), ['data', 'error', 'filepath']);
		t.is(errorEvent2.data, undefined);
		t.is(errorEvent2.filepath, filePathError2);
		t.true(errorEvent2.error instanceof Error);
		t.is(errorEvent2.error.message, `File content of type "function" is not a content type handled by files-generator.`);

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath1,
			content: fileContent1
		},{
			path: filePath2,
			content: fileContent2
		},{
			path: filePathError1,
			content: false
		},{
			path: filePathError2,
			content: false
		}], ()=>{
			t.end();
		});
	});
});
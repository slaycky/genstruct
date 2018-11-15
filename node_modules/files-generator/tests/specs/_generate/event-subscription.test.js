'use strict';

const test = require('ava');

const path = require('path');
const sinon = require('sinon');

const requireFromIndex = require('../../utils/require-from-index');

const testDirectoryMacro = require('./test-directory.macro');

const mockGenerateConfigObjectKeyName = require('../../mocks/mock-generate-config-object-key-name');
const mockFileContent = require('../../mocks/mock-file-content');

/*------------------------*/

test('generate.on is a function', t => {
	const g = requireFromIndex('sources/generate');

	t.is(g.on, undefined);

	const generate = g();

	t.is(typeof generate.on, 'function');
});

test('generate.off is a function', t => {
	const g = requireFromIndex('sources/generate');

	t.is(g.off, undefined);

	const generate = g();

	t.is(typeof generate.off, 'function');
});

test('generate.listenableEvents', t => {
	const g = requireFromIndex('sources/generate');

	t.is(g.listenableEvents, undefined);

	const generate = g();

	t.deepEqual(generate.listenableEvents, ['write', 'finish', 'error']);
});

/*------------------------*/

test.cb('finish event', t => {
	const generate = requireFromIndex('sources/generate')();

	generate();

	generate.on('error', () => t.fail());

	generate.on('finish', event=>{
		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 0);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 0);

		t.end();
	});
});

test.cb('finish event on', t => {
	const generate = requireFromIndex('sources/generate')();

	generate();

	const pass = sinon.spy();

	generate.on('error', () => t.fail());

	generate.on('finish', pass);

	generate.on('finish', event=>{
		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 0);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 0);

		t.true(pass.calledOnce);
		t.end();
	});
});

test.cb('finish event off', t => {
	const generate = requireFromIndex('sources/generate')();

	generate();

	const pass = sinon.spy();

	generate.on('error', () => t.fail());

	generate.on('finish', pass);
	generate.off('finish', pass);

	generate.on('finish', event=>{
		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 0);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 0);

		t.true(pass.notCalled);
		t.pass();
		t.end();
	});
});

test.cb('finish event off with multiple handlers', t => {
	const generate = requireFromIndex('sources/generate')();

	generate();

	const pass = sinon.spy();
	const pass2 = sinon.spy();

	generate.on('error', () => t.fail());

	generate.on('finish', pass2);
	generate.on('finish', pass);
	generate.off('finish', pass);

	generate.on('finish', event=>{
		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 0);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 0);

		t.true(pass.notCalled);
		t.true(pass2.calledOnce);
		t.pass();
		t.end();
	});
});

/*-----------------------*/

test.cb('write event', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();
	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	t.plan(14)

	const success = [];

	generate.on('error', () => t.fail());

	generate.on('write', event => {
		t.is(typeof event, 'object');
		t.is(typeof event.filepath, 'string');

		success.push(event.filepath);

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: event.filepath,
			content: ({
				[filePathOne]: fileContentOne,
				[filePathTwo]: fileContentTwo
			})[event.filepath]
		}], ()=>{
			end();
		}, {ava_t: t});
	});

	generate.on('finish', event=>{
		t.is(typeof event, 'object');

		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 0);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 2);
		t.true(event.success.includes(filePathOne));
		t.true(event.success.includes(filePathTwo));

		t.is(success.length, 2);
		t.true(success.includes(filePathOne));
		t.true(success.includes(filePathTwo));

		end();
	});

	let endCallCount = 0;
	function end() {
		endCallCount++;
		if (endCallCount === 3) {
			t.end();
		}
	}
});

test.cb('write event off', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();
	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	const handler = sinon.spy();

	generate.on('error', () => t.fail());

	generate.on('write', handler);

	generate.off('write', handler);

	generate.on('finish', ()=>{
		t.true(handler.notCalled);
		t.end();
	});
});

test.cb('write event off with multiple handlers', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();
	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	const handler1 = sinon.spy();
	const handler2 = sinon.spy();

	generate.on('error', () => t.fail());

	generate.on('write', handler1);
	generate.on('write', handler2);

	generate.off('write', handler1);

	generate.on('finish', ()=>{
		t.true(handler1.notCalled);
		t.true(handler2.calledTwice);

		const filepathsWritten = [];
		[0, 1].map(c => handler2.getCall(c).args).forEach(args => {
			t.is(args.length, 1);
			const event = args[0];

			t.is(typeof event, 'object');
			t.is(event.data, undefined);
			filepathsWritten.push(event.filepath);
		});

		t.true(filepathsWritten.includes(filePathOne));
		t.true(filepathsWritten.includes(filePathTwo));

		t.end();
	});
});

/*-----------------------*/

test.cb('error event on - event not emitted if no errors', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 3,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();
	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	generate.on('error', () => t.fail());

	generate.on('finish', event=>{
		t.is(typeof event, 'object');

		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 0);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 2);

		t.end();
	});
});

test.cb('error event on - event emitted when writeFile function call the callback with an error', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(filepath, content, options, writeFileCallback){
			writeFileCallback(new Error('write file error'));
		}
	});

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	const errors = [];
	generate.on('error', event=>{
		t.is(typeof event, 'object');
		t.is(event.data, undefined);
		t.true(event.error instanceof Error);
		t.is(typeof event.filepath, 'string');

		errors.push({
			filepath: event.filepath,
			error: event.error
		});
	})

	generate.on('write', () => t.fail());

	generate.on('finish', event=>{
		t.is(errors.length, 2);
		t.is(errors[0].filepath, filePathOne);
		t.is(errors[0].error.message, `write file error`);
		t.is(errors[1].filepath, filePathTwo);
		t.is(errors[1].error.message, `write file error`);

		t.true(event.errors instanceof Array);
		t.is(event.errors.length, 2);

		t.true(event.success instanceof Array);
		t.is(event.success.length, 0);

		t.is(event.errors[0], filePathOne);
		t.is(event.errors[1], filePathTwo);
		t.end();
	});
});

test.cb('error event on - mixed error with no errors', testDirectoryMacro, (t, directory) => {
	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathThree = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});

	const generate = requireFromIndex('sources/generate')({
		writeFile(filepath, content, options, writeFileCallback){
			writeFileCallback((
				filepath === filePathOne || filepath === filePathThree
			) ? null : new Error('mixed write file error'));
		}
	});

	const fileContentOne = mockFileContent();

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathFour = mockGenerateConfigObjectKeyName({
		depth: 3,
		absolute: directory.path
	});

	const fileContentTwo = mockFileContent();
	const fileContentThree = mockFileContent();
	const fileContentFour = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo,
		[filePathThree]: fileContentThree,
		[filePathFour]: fileContentFour
	});

	const errors = [];
	generate.on('error', event=>{
		t.is(typeof event, 'object');
		t.is(event.data, undefined);
		t.true(event.error instanceof Error);
		t.is(typeof event.filepath, 'string');
		errors.push({
			filepath: event.filepath,
			error: event.error
		});
	});

	const success = [];
	generate.on('write', event=>{
		t.is(typeof event, 'object');
		t.is(event.data, undefined);
		t.is(typeof event.filepath, 'string');
		success.push(event.filepath);
	});

	generate.on('finish', event=>{
		t.is(errors.length, 2);
		t.is(success.length, 2);

		t.is(errors[0].filepath, filePathTwo);
		t.is(errors[0].error.message, `mixed write file error`);
		t.is(errors[1].filepath, filePathFour);
		t.is(errors[1].error.message, `mixed write file error`);

		t.is(success[0], filePathOne);
		t.is(success[1], filePathThree);

		t.is(typeof event, 'object');

		t.true(event.errors instanceof Array);
		t.true(event.success instanceof Array);
		t.is(event.errors.length, 2);
		t.is(event.success.length, 2);
		t.is(event.errors[0], filePathTwo);
		t.is(event.errors[1], filePathFour);

		t.is(event.success[0], filePathOne);
		t.is(event.success[1], filePathThree);

		t.end();
	});
});

test.cb('error event on - mixed errors event emitted when writeFile function throws an error', testDirectoryMacro, (t, directory) => {
	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathThree = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});

	const generate = requireFromIndex('sources/generate')({
		writeFile(filepath, content, options, writeFileCallback){
			if (filepath === filePathOne || filepath === filePathThree) {
				throw new Error('mixed write file error');
			}
			writeFileCallback(null);
		}
	});

	const fileContentOne = mockFileContent();

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const filePathFour = mockGenerateConfigObjectKeyName({
		depth: 3,
		absolute: directory.path
	});

	const fileContentTwo = mockFileContent();
	const fileContentThree = mockFileContent();
	const fileContentFour = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo,
		[filePathThree]: fileContentThree,
		[filePathFour]: fileContentFour
	});

	const errors = [];
	generate.on('error', event=>{
		t.is(typeof event, 'object');
		t.is(event.data, undefined);
		t.is(typeof event.filepath, 'string');
		t.true(event.error instanceof Error);
		errors.push({
			filepath: event.filepath,
			error: event.error
		});
	});

	const success = [];
	generate.on('write', event=>{
		t.is(typeof event, 'object');
		t.is(event.data, undefined);
		t.is(typeof event.filepath, 'string');
		success.push(event.filepath);
	});

	generate.on('finish', event=>{
		t.is(errors.length, 2);
		t.is(success.length, 2);

		t.is(errors[0].filepath, filePathOne);
		t.is(errors[0].error.message, `mixed write file error`);
		t.is(errors[1].filepath, filePathThree);
		t.is(errors[1].error.message, `mixed write file error`);

		t.is(success[0], filePathTwo);
		t.is(success[1], filePathFour);

		t.is(typeof event, 'object');

		t.true(event.errors instanceof Array);
		t.true(event.success instanceof Array);
		t.is(event.errors.length, 2);
		t.is(event.success.length, 2);

		t.is(event.errors[0], filePathOne);
		t.is(event.errors[1], filePathThree);

		t.is(event.success[0], filePathTwo);
		t.is(event.success[1], filePathFour);

		t.end();
	});
});

test.cb('error event off', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(filepath, content, options, writeFileCallback){
			writeFileCallback(new Error('write file error'));
		}
	});

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	const listener = sinon.spy();

	generate.on('error', listener);
	generate.off('error', listener);

	generate.on('write', ()=>t.fail());

	generate.on('finish', ()=>{
		t.true(listener.notCalled);
		t.end();
	});
});

test.cb('error event off with multiple handlers', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(filepath, content, options, writeFileCallback){
			writeFileCallback(new Error('write file error'));
		}
	});

	const filePathOne = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentOne = mockFileContent();

	const filePathTwo = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});

	const fileContentTwo = mockFileContent();

	generate({
		[filePathOne]: fileContentOne,
		[filePathTwo]: fileContentTwo
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();

	generate.on('error', listener1);
	generate.on('error', listener2);
	generate.off('error', listener1);

	generate.on('write', ()=>t.fail());

	generate.on('finish', ()=>{
		t.true(listener1.notCalled);
		t.true(listener2.calledTwice);
		t.end();
	});
});

/*-----------------------*/

test.cb('generate multiple on for the same event (test with finish event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.js': 'fake content 1',
		'/filepath/fake/file2.js': 'fake content 2'
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();

	generate.on('error', ()=>t.fail());

	generate.on('finish', listener1);
	generate.on('finish', listener2);

	generate.on('finish', ()=>{
		t.true(listener1.calledOnce);
		t.true(listener2.calledOnce);

		t.end();
	});
});

test.cb('generate multiple off for the same event (test with finish event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.js': 'fake content 1',
		'/filepath/fake/file2.js': 'fake content 2'
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();
	const listener3 = sinon.spy();
	const listener4 = sinon.spy();

	generate.on('error', ()=>t.fail());

	generate.on('finish', listener1);
	generate.on('finish', listener2);
	generate.on('finish', listener3);
	generate.on('finish', listener4);

	generate.off('finish', listener2);
	generate.off('finish', listener3);

	generate.on('finish', ()=>{
		t.true(listener1.calledOnce);
		t.true(listener2.notCalled);
		t.true(listener3.notCalled);
		t.true(listener4.calledOnce);

		t.end();
	});
});

test.cb('generate multiple on for the same event (test with write event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.js': 'fake content 1',
		'/filepath/fake/file2.js': 'fake content 2'
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();

	generate.on('error', ()=>t.fail());

	generate.on('write', listener1);
	generate.on('write', listener2);

	generate.on('finish', ()=>{
		t.true(listener1.calledTwice);
		t.true(listener2.calledTwice);

		t.end();
	});
});

test.cb('generate multiple off for the same event (test with write event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.js': 'fake content 1',
		'/filepath/fake/file2.js': 'fake content 2'
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();
	const listener3 = sinon.spy();
	const listener4 = sinon.spy();

	generate.on('error', ()=>t.fail());

	generate.on('write', listener1);
	generate.on('write', listener2);
	generate.on('write', listener3);
	generate.on('write', listener4);

	generate.off('write', listener2);
	generate.off('write', listener3);

	generate.on('finish', ()=>{
		t.true(listener1.calledTwice);
		t.true(listener2.notCalled);
		t.true(listener3.notCalled);
		t.true(listener4.calledTwice);

		t.end();
	});
});

test.cb('generate multiple on for the same event (test with error event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(ct === 'error' ? new Error('error writing file mock') : null);
		}
	});

	generate({
		'/filepath/fake/file1.js': 'error',
		'/filepath/fake/file2.js': 'fake content 2',
		'/filepath/fake/file3.js': 'fake content 1',
		'/filepath/fake/file4.js': 'error'
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();

	generate.on('error', listener1);
	generate.on('error', listener2);

	generate.on('finish', ()=>{
		t.true(listener1.calledTwice);
		t.true(listener2.calledTwice);

		t.end();
	});
});

test.cb('generate multiple off for the same event (test with error event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(ct === 'error' ? new Error('error writing file mock') : null);
		}
	});

	generate({
		'/filepath/fake/file1.js': 'error',
		'/filepath/fake/file2.js': 'fake content 2',
		'/filepath/fake/file3.js': 'fake content 1',
		'/filepath/fake/file4.js': 'error'
	});

	const listener1 = sinon.spy();
	const listener2 = sinon.spy();
	const listener3 = sinon.spy();
	const listener4 = sinon.spy();

	generate.on('error', listener1);
	generate.on('error', listener2);
	generate.on('error', listener3);
	generate.on('error', listener4);

	generate.off('error', listener2);
	generate.off('error', listener3);

	generate.on('finish', ()=>{
		t.true(listener1.calledTwice);
		t.true(listener2.notCalled);
		t.true(listener3.notCalled);
		t.true(listener4.calledTwice);

		t.end();
	});
});

test.cb('generate multiple on for the same listener', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(ct === 'error' ? new Error('error writing file mock') : null);
		}
	});

	generate({
		'/filepath/fake/file1.js': 'error',
		'/filepath/fake/file2.js': 'fake content 2',
		'/filepath/fake/file3.js': 'fake content 1',
		'/filepath/fake/file4.js': 'error',
		'/filepath/fake/file5.js': 'error'
	});

	const listener = sinon.spy();

	generate.on('write', listener);
	generate.on('error', listener);
	generate.on('finish', listener);

	generate.on('finish', () => {
		t.is(listener.callCount, 6);

		const call0 = listener.getCall(0).args;
		t.is(call0.length, 1);
		const event0 = call0[0];
		t.is(typeof event0, 'object');
		t.deepEqual(Object.keys(event0), ['data', 'filepath', 'error']);
		t.is(event0.data, undefined);
		t.is(event0.filepath, '/filepath/fake/file1.js');
		t.true(event0.error instanceof Error);
		t.is(event0.error.message, 'error writing file mock');

		const call1 = listener.getCall(1).args;
		t.is(call1.length, 1);
		const event1 = call1[0];
		t.is(typeof event1, 'object');
		t.deepEqual(Object.keys(event1), ['data', 'filepath']);
		t.is(event1.data, undefined);
		t.is(event1.filepath, '/filepath/fake/file2.js');

		const call2 = listener.getCall(2).args;
		t.is(call2.length, 1);
		const event2 = call2[0];
		t.is(typeof event2, 'object');
		t.deepEqual(Object.keys(event2), ['data', 'filepath']);
		t.is(event2.data, undefined);
		t.is(event2.filepath, '/filepath/fake/file3.js');

		const call3 = listener.getCall(3).args;
		t.is(call3.length, 1);
		const event3 = call3[0];
		t.is(typeof event3, 'object');
		t.deepEqual(Object.keys(event3), ['data', 'filepath', 'error']);
		t.is(event3.data, undefined);
		t.is(event3.filepath, '/filepath/fake/file4.js');
		t.true(event3.error instanceof Error);
		t.is(event3.error.message, 'error writing file mock');

		const call4 = listener.getCall(4).args;
		t.is(call4.length, 1);
		const event4 = call4[0];
		t.is(typeof event4, 'object');
		t.deepEqual(Object.keys(event4), ['data', 'filepath', 'error']);
		t.is(event4.data, undefined);
		t.is(event4.filepath, '/filepath/fake/file5.js');
		t.true(event4.error instanceof Error);
		t.is(event4.error.message, 'error writing file mock');

		const call5 = listener.getCall(5).args;
		t.is(call5.length, 1);
		const event5 = call5[0];
		t.is(typeof event5, 'object');
		t.deepEqual(Object.keys(event5), ['data', 'errors', 'success']);
		t.is(event5.data, undefined);
		t.deepEqual(event5.errors, ['/filepath/fake/file1.js', '/filepath/fake/file4.js', '/filepath/fake/file5.js']);
		t.deepEqual(event5.success, ['/filepath/fake/file2.js', '/filepath/fake/file3.js']);

		t.end();
	});
});

test.cb('generate multiple off for the same listener', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(ct === 'error' ? new Error('error writing file mock') : null);
		}
	});

	generate({
		'/filepath/fake/file1.js': 'error',
		'/filepath/fake/file2.js': 'content'
	});

	const listener = sinon.spy();

	generate.on('write', listener);
	generate.on('error', listener);
	generate.on('finish', listener);

	generate.off('write', listener);
	generate.off('error', listener);
	generate.off('finish', listener);

	generate.on('finish', () => {
		t.is(listener.callCount, 0);

		t.end();
	});
});

test('generate multiple on for the same event and listener (test with finish event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	generate.on('error', ()=>t.fail());

	generate.on('finish', listener);

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.on('finish', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `The same listener is used twice on the event "finish".`);
});

test('generate multiple on for the same event and listener (test with write event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	generate.on('error', ()=>t.fail());

	generate.on('write', listener);

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.on('write', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `The same listener is used twice on the event "write".`);
});

test('generate multiple on for the same event and listener (test with error event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	generate.on('error', listener);

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.on('error', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `The same listener is used twice on the event "error".`);
});

test('generate off on unlistened listener (test with finish event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.off('finish', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `generate.off called with an unregistered listener on "finish".`);
});

test('generate off on unlistened listener (test with write event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.off('write', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `generate.off called with an unregistered listener on "write".`);
});

test('generate off on unlistened listener (test with error event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.off('error', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `generate.off called with an unregistered listener on "error".`);
});

test('generate multiple off for the same event and listener (test with finish event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	generate.on('finish', listener);
	generate.off('finish', listener);

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.off('finish', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `generate.off called with an unregistered listener on "finish".`);
});

test('generate multiple off for the same event and listener (test with write event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	generate.on('write', listener);
	generate.off('write', listener);

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.off('write', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `generate.off called with an unregistered listener on "write".`);
});

test('generate multiple off for the same event and listener (test with error event)', t => {
	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opt, cl){
			cl(null);
		}
	});

	generate({
		'/filepath/fake/file.txt': 'content'
	});

	const listener = sinon.spy();

	generate.on('error', listener);
	generate.off('error', listener);

	const listenerUsedTwiceForSameEventError = t.throws(() => {
		generate.off('error', listener);
	});

	t.is(listenerUsedTwiceForSameEventError.message, `generate.off called with an unregistered listener on "error".`);
});

/*-----------------------*/

test.cb('generate.off()', t => {
	const generate = requireFromIndex('sources/generate')();

	generate();

	const pass1 = sinon.spy();
	const pass2 = sinon.spy();
	const pass3 = sinon.spy();
	const pass4 = sinon.spy();
	const pass5 = sinon.spy();

	generate.on('finish', pass2);
	generate.on('write', pass3)
	generate.on('error', pass1);
	generate.on('finish', pass1);
	generate.on('write', pass2)
	generate.on('error', pass2);
	generate.on('finish', pass5);
	generate.on('write', pass5)
	generate.on('error', pass5);
	generate.on('finish', pass3);
	generate.on('write', pass1)
	generate.on('error', pass4);
	generate.on('finish', pass4);
	generate.on('write', pass4)
	generate.on('error', pass3);

	generate.off('finish', pass5);
	generate.off('finish', pass2);

	generate.on('finish', ()=>{
		t.true(pass1.calledOnce);
		t.true(pass3.calledOnce);
		t.true(pass4.calledOnce);
		t.true(pass2.notCalled);
		t.true(pass5.notCalled);

		t.end();
	});
});

/*--------------------*/
/*----- eventData ----*/
/*--------------------*/

test.cb('default eventData with finish event', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	t.plan(4);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	generate.on('finish', event => {
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.deepEqual(event, {
				data: undefined,
				errors: [],
				success: [filePath]
			});
			t.pass();
			t.end();
		}, {ava_t: t});
	});
});

test.cb('override eventData using the instance generator with finish event', testDirectoryMacro, (t, directory) => {
	const data = 'data as string';

	const generate = requireFromIndex('sources/generate')({
		eventData: data
	});

	t.plan(4);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', ()=>t.fail());

	generate.on('finish', event=>{
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.deepEqual(event, {
				data: 'data as string',
				errors: [],
				success: [filePath]
			});
			t.pass();
			t.end();
		});
	});
});

test.cb('override eventData using the generate function with finish event', testDirectoryMacro, (t, directory) => {
	const data = {dataKey: 'data value'};

	const generate = requireFromIndex('sources/generate')();

	t.plan(5);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 2,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		eventData: data
	});

	generate.on('error', ()=>t.fail());

	generate.on('finish', event=>{
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.is(event.data, data);
			t.deepEqual(event, {
				data: {dataKey: 'data value'},
				errors: [],
				success: [filePath]
			});
			t.pass();
			t.end();
		});
	});
});

test.cb('override eventData using the generate function after using the instance generator with finish event', testDirectoryMacro, (t, directory) => {
	const data = 42;

	const generate = requireFromIndex('sources/generate')({
		eventData: {dataKey2: 'data value'}
	});

	t.plan(5);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		eventData: data
	});

	generate.on('error', () => t.fail());

	generate.on('finish', event=>{
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.is(event.data, data);
			t.deepEqual(event, {
				data: 42,
				errors: [],
				success: [filePath]
			});
			t.pass();
			t.end();
		});
	});
});

/*----------------*/

test.cb('default eventData with write event', testDirectoryMacro, (t, directory) => {
	const generate = requireFromIndex('sources/generate')();

	t.plan(4);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', () => t.fail());

	generate.on('write', event => {
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.deepEqual(event, {
				data: undefined,
				filepath: filePath
			});
			t.pass();
			t.end();
		}, {ava_t: t});
	});
});

test.cb('override eventData using the instance generator with write event', testDirectoryMacro, (t, directory) => {
	const data = 'data as string';

	const generate = requireFromIndex('sources/generate')({
		eventData: data
	});

	t.plan(4);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	});

	generate.on('error', () => t.fail());

	generate.on('write', event => {
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.deepEqual(event, {
				data,
				filepath: filePath
			});
			t.pass();
			t.end();
		}, {ava_t: t});
	});
});

test.cb('override eventData using the generate function with write event', testDirectoryMacro, (t, directory) => {
	const data = 46;

	const generate = requireFromIndex('sources/generate')();

	t.plan(4);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		eventData: data
	});

	generate.on('error', () => t.fail());

	generate.on('write', event => {
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.deepEqual(event, {
				data,
				filepath: filePath
			});
			t.pass();
			t.end();
		}, {ava_t: t});
	});
});

test.cb('override eventData using the generate function after using the instance generator with write event', testDirectoryMacro, (t, directory) => {
	const data = {dataKey: 'data-value'};

	const generate = requireFromIndex('sources/generate')({
		eventData: 56
	});

	t.plan(4);

	const filePath = mockGenerateConfigObjectKeyName({
		depth: 1,
		absolute: directory.path
	});
	const fileContent = mockFileContent();

	generate({
		[filePath]: fileContent
	}, {
		eventData: data
	});

	generate.on('error', () => t.fail());

	generate.on('write', event => {
		t.pass();

		directory.assertAllFilesExist([...directory.initialFilesList, {
			path: filePath,
			content: fileContent
		}], ()=>{
			t.is(typeof event, 'object');
			t.deepEqual(event, {
				data,
				filepath: filePath
			});
			t.pass();
			t.end();
		}, {ava_t: t});
	});
});

/*----------------*/

test.cb('default eventData with error event', testDirectoryMacro, (t, directory) => {
	const writeFileError = new Error('writefile callback error');

	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opts, cb){
			cb(writeFileError);
		}
	});

	generate({
		'/absolute/file/path/file.js': 'file content'
	});

	generate.on('write', () => t.fail());

	generate.on('error', event => {
		t.is(typeof event, 'object');
		t.deepEqual(event, {
			data: undefined,
			error: writeFileError,
			filepath: '/absolute/file/path/file.js'
		});
		t.end();
	});
});

test.cb('override eventData using the instance generator with error event', testDirectoryMacro, (t, directory) => {
	const writeFileError = new Error('writefile callback error');

	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opts, cb){
			cb(writeFileError);
		},
		eventData: 'data as string test'
	});

	generate({
		'/absolute/file/path/file.js': 'file content'
	});

	generate.on('write', () => t.fail());

	generate.on('error', event => {
		t.is(typeof event, 'object');
		t.deepEqual(event, {
			data: 'data as string test',
			error: writeFileError,
			filepath: '/absolute/file/path/file.js'
		});
		t.end();
	});
});

test.cb('override eventData using the generate function with error event', testDirectoryMacro, (t, directory) => {
	const writeFileError = new Error('writefile callback error');

	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opts, cb){
			cb(writeFileError);
		}
	});

	generate({
		'/absolute/file/path/file.js': 'file content'
	}, {
		eventData: {
			dataKey: 'data value',
			dataKey2: 'other data value'
		}
	});

	generate.on('write', () => t.fail());

	generate.on('error', event => {
		t.is(typeof event, 'object');
		t.deepEqual(event, {
			data: {
				dataKey: 'data value',
				dataKey2: 'other data value'
			},
			error: writeFileError,
			filepath: '/absolute/file/path/file.js'
		});
		t.end();
	});
});

test.cb('override eventData using the generate function after using the instance generator with error event', testDirectoryMacro, (t, directory) => {
	const writeFileError = new Error('writefile callback error');

	const generate = requireFromIndex('sources/generate')({
		writeFile(fp, ct, opts, cb){
			cb(writeFileError);
		},
		eventData: 'string data'
	});

	generate({
		'/absolute/file/path/file.js': 'file content'
	}, {
		eventData: 42
	});

	generate.on('write', () => t.fail());

	generate.on('error', event => {
		t.is(typeof event, 'object');
		t.deepEqual(event, {
			data: 42,
			error: writeFileError,
			filepath: '/absolute/file/path/file.js'
		});
		t.end();
	});
});

/*----------------*/

function generateOnWithWrongArgumentsMacro(t, errorMessage, ...wrongArgs) {
	const generate = requireFromIndex('sources/generate')();

	const onWrongArgsError = t.throws(() => {
		generate.on(...wrongArgs);
	});

	t.is(onWrongArgsError.message, errorMessage);
}

generateOnWithWrongArgumentsMacro.title = providedTitle => (
	`generate on with wrong arguments - ${providedTitle}`
)

const wrongEventParameterErrorMessage =
	'The event parameter must be one of the following string: "write", "finish" or "error".';

const wrongListenerParameterErrorMessage =
	'The event listener parameter must be a function.';

test('without parameters', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage);
test('with function', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, function test() {return;});
test('with number', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 42);
test('with symbol', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, Symbol());
test('with object', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, {});
test('with array', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, [87, false]);
test('with empty array', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, []);
test('with true', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, true);
test('with false', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, false);
test('with null', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, null);
test('with undefined', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, undefined);
test('with wrong string', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 'wite');
test('with wrong string 2', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 'finih');
test('with wrong string 3', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 'err');
test('with empty string', generateOnWithWrongArgumentsMacro, wrongEventParameterErrorMessage, '  	');

test('without parameters', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write');
test('with number', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 42);
test('with symbol', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', Symbol());
test('with object', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', {});
test('with array', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', [87, false]);
test('with empty array', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', []);
test('with true', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', true);
test('with false', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', false);
test('with null', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', null);
test('with undefined', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', undefined);
test('with wrong string', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 'write');
test('with wrong string 2', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 'finish');
test('with wrong string 3', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 'error');
test('with empty string', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', '  	');

test('without parameters', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish');
test('with number', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 42);
test('with symbol', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', Symbol());
test('with object', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', {});
test('with array', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', [87, false]);
test('with empty array', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', []);
test('with true', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', true);
test('with false', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', false);
test('with null', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', null);
test('with undefined', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', undefined);
test('with wrong string', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 'write');
test('with wrong string 2', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 'finish');
test('with wrong string 3', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 'error');
test('with empty string', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', '  	');

test('without parameters', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error');
test('with number', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 42);
test('with symbol', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', Symbol());
test('with object', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', {});
test('with array', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', [87, false]);
test('with empty array', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', []);
test('with true', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', true);
test('with false', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', false);
test('with null', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', null);
test('with undefined', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', undefined);
test('with wrong string', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 'write');
test('with wrong string 2', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 'finish');
test('with wrong string 3', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 'error');
test('with empty string', generateOnWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', '  	');

function generateOffWithWrongArgumentsMacro(t, errorMessage, ...wrongArgs) {
	const generate = requireFromIndex('sources/generate')();

	const offWrongArgsError = t.throws(() => {
		generate.off(...wrongArgs);
	});

	t.is(offWrongArgsError.message, errorMessage);
}

generateOffWithWrongArgumentsMacro.title = providedTitle => (
	`generate off with wrong arguments - ${providedTitle}`
)

test('without parameters', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage);
test('with function', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, function test() {return;});
test('with number', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 42);
test('with symbol', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, Symbol());
test('with object', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, {});
test('with array', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, [87, false]);
test('with empty array', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, []);
test('with true', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, true);
test('with false', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, false);
test('with null', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, null);
test('with undefined', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, undefined);
test('with wrong string', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 'wite');
test('with wrong string 2', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 'finih');
test('with wrong string 3', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, 'err');
test('with empty string', generateOffWithWrongArgumentsMacro, wrongEventParameterErrorMessage, '  	');

test('without parameters', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write');
test('with number', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 42);
test('with symbol', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', Symbol());
test('with object', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', {});
test('with array', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', [87, false]);
test('with empty array', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', []);
test('with true', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', true);
test('with false', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', false);
test('with null', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', null);
test('with undefined', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', undefined);
test('with wrong string', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 'write');
test('with wrong string 2', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 'finish');
test('with wrong string 3', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', 'error');
test('with empty string', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'write', '  	');

test('without parameters', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish');
test('with number', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 42);
test('with symbol', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', Symbol());
test('with object', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', {});
test('with array', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', [87, false]);
test('with empty array', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', []);
test('with true', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', true);
test('with false', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', false);
test('with null', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', null);
test('with undefined', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', undefined);
test('with wrong string', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 'write');
test('with wrong string 2', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 'finish');
test('with wrong string 3', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', 'error');
test('with empty string', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'finish', '  	');

test('without parameters', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error');
test('with number', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 42);
test('with symbol', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', Symbol());
test('with object', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', {});
test('with array', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', [87, false]);
test('with empty array', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', []);
test('with true', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', true);
test('with false', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', false);
test('with null', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', null);
test('with undefined', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', undefined);
test('with wrong string', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 'write');
test('with wrong string 2', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 'finish');
test('with wrong string 3', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', 'error');
test('with empty string', generateOffWithWrongArgumentsMacro, wrongListenerParameterErrorMessage, 'error', '  	');
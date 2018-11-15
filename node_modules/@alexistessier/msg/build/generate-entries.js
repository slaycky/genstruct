'use strict';

const path = require('path');

const readYaml = require('read-yaml');

const entries = readYaml.sync(path.join(__dirname, `../sources/entries.yaml`), {encoding: 'utf-8'});

/*--------------*/

const fs = require('fs');
const mustache = require('mustache');

const template = fs.readFileSync(path.join(__dirname, 'entry.tpl.js'), {
	encoding: 'utf-8'
});

for(const entry in entries){
	fs.writeFileSync(
		path.join(__dirname, `../${entry}.js`),
		mustache.render(template, {
			entryPath: entries[entry]
		}), {
			encoding: 'utf-8'
		}
	);
}
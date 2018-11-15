'use strict';

const path = require('path');

const readYaml = require('read-yaml');

module.exports = readYaml.sync(path.join(__dirname, `../sources/documentation-introduction.yaml`), {encoding: 'utf-8'});
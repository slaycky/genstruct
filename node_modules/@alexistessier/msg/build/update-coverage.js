'use strict';

const shell = require('shelljs');

setInterval(()=>{
	shell.exec('npm run coverage');
}, 30000);
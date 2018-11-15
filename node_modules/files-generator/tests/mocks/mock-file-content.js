'use strict';

const randomstring = require("randomstring");

function mockFileContent(){
	return `à é @ # & _ ° % $ £ ^^ ù = + / ? ç ! è § \t \n file-content-${randomstring.generate()}`;
}

module.exports = mockFileContent;
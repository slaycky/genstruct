'use strict';

var Remarkable = require('remarkable');
var md = new Remarkable();

module.exports = function markdownToHtml(markdown) {
	return md.render(markdown);
}
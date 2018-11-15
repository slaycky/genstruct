'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const markdownToHtml = require('./markdown-to-html');

const readme = fs.readFileSync(path.join(__dirname, '../README.md'), {
	encoding: 'utf-8'
});

const githubMarkdownCSS = require.resolve('github-markdown-css');
const githubCSS = 'github-markdown.css';
const cssOutputPath = path.join(__dirname, '../documentation/', githubCSS);

fs.writeFile(path.join(__dirname, '../documentation/readme.html'), template(markdownToHtml(readme)), {
	encoding: 'utf-8'
});

shell.exec(`cp ${githubMarkdownCSS} ${cssOutputPath}`)

function template(content) {
	return `
<doctype>
<html>
<head>
<link rel="stylesheet" href="/${githubCSS}">
</head>
<body>
<style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}
</style>
<div class="markdown-body">
${content}
</div>
</body>
</html>
`.trim()
}
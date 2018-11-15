{{formatedName}}
================

{{#stability}}
[![{{{stability}}}](http://badges.github.io/stability-badges/dist/{{{stability}}}.svg)](http://github.com/badges/stability-badges)
{{/stability}}
{{^stability}}
![draft](https://img.shields.io/badge/stability-draft-lightgrey.svg?style=flat-square)
{{/stability}}

![Branch : {{{currentBranch}}}](https://img.shields.io/badge/Branch-{{{currentBranch}}}-blue.svg)
[![version](https://img.shields.io/badge/version-{{{version}}}-blue.svg)]({{{homepage}}})
[![npm version](https://badge.fury.io/js/{{{furyName}}}.svg)](https://badge.fury.io/js/{{{furyName}}})

[![Build Status](https://travis-ci.org/{{{author.login.github}}}/{{{unscopedName}}}.svg?branch={{{currentBranch}}})](https://travis-ci.org/{{{author.login.github}}}/{{{unscopedName}}})
[![Coverage Status](https://coveralls.io/repos/{{{author.login.github}}}/{{{unscopedName}}}/badge.svg?branch={{{currentBranch}}}&service=github)](https://coveralls.io/github/{{{author.login.github}}}/{{{unscopedName}}}?branch={{{currentBranch}}})

[![Dependency Status](https://david-dm.org/{{{author.login.github}}}/{{{unscopedName}}}.svg)](https://david-dm.org/{{{author.login.github}}}/{{{unscopedName}}})
[![devDependency Status](https://david-dm.org/{{{author.login.github}}}/{{{unscopedName}}}/dev-status.svg)](https://david-dm.org/{{{author.login.github}}}/{{{unscopedName}}}#info=devDependencies)

{{description}}

{{#menu}}
+ [{{{label}}}](#{{{anchor}}})
{{/menu}}
+ [License](#license)

{{#content}}

{{#section}}
## {{{section}}}
{{/section}}

{{#title}}
### {{{title}}}
{{/title}}

{{#subtitle}}
#### {{{subtitle}}}
{{/subtitle}}

{{#p}}
{{{p}}}
{{/p}}

{{#li}}
+ {{{li}}}
{{/li}}

{{#cli}}
```
{{{cli}}}
```
{{/cli}}

{{#js}}
```javascript
{{{js}}}
```
{{/js}}

{{/content}}

## License

{{{name}}} is released under [{{{license}}}]({{{licenseUrl}}}). 
Copyright (c) {{{licenseDate}}} [{{{author.name}}}]({{{author.github}}})
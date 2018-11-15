/*---------*/

const generate = require('generate')();

generate({
	"simple/file.txt": "simple content", //DONE
	"simple/file/options.txt": generate.use("simple content", {encoding:'utf-8'}), //DONE
		// eventData, DONE
		// writeFile, DONE
		// encoding, DONE
		// cwd: process.cwd(), DONE
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}


	"simple/file/using/util.txt": generate.content("simple content"),
	"simple/file/using/util/options.txt": generate.content("simple content", {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"simple/file/using/copy/util.txt": generate.content.copy("file/to/copy.txt"),
	"simple/file/using/copy/util/options.txt": generate.content.copy("file/to/copy.txt", {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}
	
	"simple/file/using/from/util.txt": generate.content.from("other/generated/file/path.txt"),
	"simple/file/using/from/util/options.txt": generate.content.from("other/generated/file/path.txt", {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/buffer.txt": Buffer.from('buffer content'),
	"file/from/buffer/options.txt": generate.use(Buffer.from('buffer content'), {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/buffer/using/util.txt": generate.buffer('buffer content'),
	"file/from/buffer/using/util/options.txt": generate.buffer('buffer content', {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/buffer/using/copy/util.txt": generate.buffer.copy("file/to/copy.txt"),
	"file/from/buffer/using/copy/util/options.txt": generate.buffer.copy("file/to/copy.txt", {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}
	
	"file/from/buffer/using/from/util.txt": generate.buffer.from("other/generated/file/path.txt"),
	"file/from/buffer/using/from/util/options.txt": generate.buffer.from("other/generated/file/path.txt", {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/stream.txt": intoStream('stream content'),
	"file/from/stream/options.txt": generate.use(intoStream('stream content'), {encoding:'utf-8'}),
		// eventData
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/stream/using/util.txt": generate.stream("file-content using stream"),
	"file/from/stream/using/util/options.txt": generate.stream("file-content using stream", {encoding:'utf-8'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/stream/using/copy/util.txt": generate.stream.copy("file/to/copy.txt"),
	"file/from/stream/using/copy/util/options.txt": generate.stream.copy("file/to/copy.txt", {encoding:'utf-8'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}
	
	"file/from/stream/using/from/util.txt": generate.stream.from("other/generated/file/path.txt"),
	"file/from/stream/using/from/util/options.txt": generate.stream.from("other/generated/file/path.txt", {encoding:'utf-8'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"generate-step": generate.step(generate.stream.copy('file.txt')),
	"generate/step/file.txt": generate.stream.from("generate-step"),
	"generate-step-options": generate.step(generate.stream.copy('file.txt'), {encoding: 'utf-8'}),
	"generate/step/file/options.txt": generate.stream.from("generate-step"),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"generate-wait": generate.await("generate-step", "from/pattern/options/{{name}}.js", (
		step, fromPattern, cb
	)=>{

	}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"empty/directory": true,
	"empty/directory": {},
	"empty/directory/using/util": generate.directory(),
	"empty/directory/using/util/options": generate.directory(null, {encoding: 'utf-8'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}
	"directory": {
		'subdirectory': generate.directory(),
		'subfilename.txt': 'file content'
	},
	"directory/using/util": generate.directory({
		'subdirectory': generate.directory(),
		'subfilename.txt': 'file content'
	}),
	"directory/using/util/options": generate.directory({
		'subdirectory': generate.directory(),
		'subfilename.txt': 'file content'
	}, {encoding: 'utf-8'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"directory/to/copy": generate.directory.copy("path/to/copy"),
	"directory/to/copy/options": generate.directory.copy("path/to/copy", {encoding:'iso'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"path/from/copy.txt": generate.copy("path/to/copy.txt"),
	"path/from/copy/options.txt": generate.copy("path/to/copy.txt", {encoding:'iso'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"path/from/copy/directory": generate.copy("path/to/copy"),
	"path/from/copy/directory/options.txt": generate.copy("path/to/copy", {encoding:'iso'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"from/mutiple/files.js": generate.glob('**/*.js', (files, cb) => {

	}),
	"from/mutiple/files/options.js": generate.glob('**/*.js', {encoding:'iso'}, (files, cb) => {

	}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}


	"from/pattern/{{name}}.js": generate.pattern({
		name: 'filename'
	}, 'file content'),
	"from/pattern/options/{{name}}.js": generate.pattern({
		name: 'filename'
	}, 'file content', {encoding:'iso'}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"from/multiple/files/pattern/{{title}}.{{hash}}.{{ext}}": generate.glob('**/*.png', (files, cb) => {
		files.forEach(file => {
			cb(generate.pattern({
				title: 'title',
				hash: hash('title'),
				ext: '.txt'
			}, 'file content'))
		})
	}),
	"from/multiple/files/pattern/{{title}}.{{hash}}.{{ext}}": generate.glob('**/*.png', {encoding:'iso'}, (files, cb) => {
		files.forEach(file => {
			cb(generate.pattern({
				title: 'title',
				hash: hash('title'),
				ext: '.txt'
			}, 'file content'))
		})
	}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"from/multiple/files/pattern/{{title}}.{{hash}}.{{ext}}": generate.glob('**/*.png', (files, cb) => {
		files.forEach(file => {
			cb(generate.pattern({
				title: 'title',
				hash: hash('title'),
				ext: '.txt'
			}, 'file content', {encoding:'iso'}))
			// eventData,
			// writeFile,
			// encoding,
			// cwd: process.cwd(),
			// rootPath: '',
			// override: [true, false, Error],
			// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
			// backupStrategyOptions: {}
		})
	}),
	"from/multiple/files/pattern/{{title}}.{{hash}}.{{ext}}": generate.glob('**/*.png', {encoding:'iso'}, (files, cb) => {
		files.forEach(file => {
			cb(generate.pattern({
				title: 'title',
				hash: hash('title'),
				ext: '.txt'
			}, 'file content', {encoding:'iso'}))
			// eventData,
			// writeFile,
			// encoding,
			// cwd: process.cwd(),
			// rootPath: '',
			// override: [true, false, Error],
			// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
			// backupStrategyOptions: {}
		})
	}),
		// eventData,
		// writeFile,
		// encoding,
		// cwd: process.cwd(),
		// rootPath: '',
		// override: [true, false, Error],
		// backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
		// backupStrategyOptions: {}

	"file/from/a/plugin/": generate.use(plugin),
	"file/from/a/plugin/options": generate.use(plugin, {encoding:'iso'}),

	"images/from/a/plugin/{{title}}.{{hash}}.{{ext}}": generate.use(imageMin),
	"get-image-path/from/a/plugin.js": generate.use(imageMin.getImagePath),

	"path/from/a/callable": (err, cb) => {
		cb(null, 'file content')
	},

	"path/to/remove": false,
	"path/to/remove": generate.remove(),
	"path/to/remove": generate.remove({option: 'value'})
})

const availableOptions = {
	watch,
	eventData,
	writeFile,
	encoding,
	cwd: process.cwd(),
	rootPath: '',
	override: [true, false, Error],
	backupStrategy: [false, null, 'trash', 'backup-file', function customStrategy(){}],
	backupStrategyOptions: {}
};
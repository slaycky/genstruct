#! /usr/bin/env node
const generate = require('files-generator')();
const fs = require('fs');
const args = process.argv;

const name = args[3]
const currentPath = process.cwd()
const dir = 'templates';
let make_dir;

console.log('Gerando arquivos com o nome ', name)

if (args[2] == '-s' && args[3] !== undefined) {
  if (fs.existsSync(dir)) make_dir = 'templates/react-native/screen/';
  else make_dir = currentPath+'/node_modules/genstruct/templates/react-native/screen/';
  container(name,make_dir);
  presentational(name,make_dir);
  index_presentational(name,make_dir);
  screen(name,make_dir);
  generate.on('finish', event => { console.log('Finished!', event.success) })
} else if (args[2] == '-r' && args[3] !== undefined) {
  if (fs.existsSync(dir)) make_dir = 'templates/react-native/reducer/';
  else make_dir = currentPath+'/node_modules/genstruct/templates/react-native/reducer/';
  reducer(name,make_dir);
  action(name,make_dir);
  useCase(name,make_dir);
  generate.on('finish', event => { console.log('Finished!', event.success) })
} else {
  helper()
}

helper = () => {
  console.log('Generate files');
  console.log('----------------');
  console.log('node genstruct -s NameScreen');
}

function container(name,dir) {
  var file = dir+'container.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase());
    generate({ ['src/components/container/'+name+'Container.js']: result });
  });
}

function presentational(name,dir) {
  let file = dir+'presentational.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase());
    generate({ ['src/components/presentational/'+name+'/'+name+'.js']: result });
  });
}

function index_presentational(name,dir) {
  let file = dir+'index_presentational.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase());
    generate({ ['src/components/presentational/'+name+'/index.js']: result });
  });
}

function screen(name,dir) {
  let file = dir+'screen.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase());
    generate({ ['src/screens/'+name+'Screen.js']: result });
  });
}

function reducer(name,dir) {
  let file = dir+'reducer.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase());
    generate({ ['src/reducers/'+name+'Reducer.js']: result });
  });
}

function action(name,dir) {
  let file = dir+'action.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase());
    generate({ ['src/actions/'+name+'Action.js']: result });
  });
}

function useCase(name,dir) {
  let file = dir+'useCase.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase());
    generate({ ['src/useCases/'+name+'UseCase.js']: result });
  });
}

#! /usr/bin/env node
const generate = require('files-generator')();
var fs = require('fs');
var cmd=require('node-cmd');

const args = process.argv;
if (args[2] == '-s' && args[3] !== undefined){
  startGenerate(args);
}else{
  helper()
}

function helper(){
  console.log("Generate files");
  console.log("----------------");
  console.log("node genstruct -s NameScreen");
}

function getNodePath(){
  return new Promise(function(resolve, reject){
    cmd.get(
      'npm root -g',
      function(err, data, stderr){
        if (err){
          reject(err)
        } else {
          resolve(data)
        }
      }
  );
  });
}

function startGenerate(args){
  let name = args[3]
  getNodePath().then(function(path){
    var currentPath = process.cwd();
    var nodePath = path.replace(/\n/g, '');;
    var dir = "templates";
    let makeDir ;
    if (fs.existsSync(dir)){
      makeDir = 'templates/';
      console.log("GET TEMPLATE ROOT APP PATH");
    }else {
      if(fs.existsSync(nodePath)){
        console.log("GET TEMPLATE ROOT NODE PATH");
        makeDir = nodePath+'/genstruct/templates/';
      }else{
        console.log("GET TEMPLATE ROOT DEPENDENCE PATH");
        makeDir = currentPath+'/node_modules/genstruct/templates/';
      }
      
    }
    container(name,makeDir);
    presentational(name,makeDir);
    index_presentational(name,makeDir);
    screen(name,makeDir);
    generate.on('finish', event => {
        console.log("Finished!",event.success)
    })
  }).catch(function(error){
   console.log(error)
});
}

function container(name,dir){
  var file = dir+'container.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase());
    generate({
      ["src/components/container/"+name+"Container.js"]: result,
      });
    
  });
}



function presentational(name,dir){

  let file = dir+'presentational.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase());
    generate({
      ["src/components/presentational/"+name+"/"+name+".js"]: result,
      });
    
  });
}
function index_presentational(name,dir){
  let file = dir+'index_presentational.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase());
    generate({
      ["src/components/presentational/"+name+"/index.js"]: result,
      });
   
  });
}

function screen(name,dir){
  let file = dir+'screen.js'
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase());
    generate({
      ["src/screens/"+name+"Screen.js"]: result,
      });
    
  });
}
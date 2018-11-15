#! /usr/bin/env node
const generate = require('files-generator')();
var fs = require('fs');
const args = process.argv;
if (args[2] == '-s' && args[3] !== undefined){
  let name = args[3]
  console.log("Gerando arquivos com o nome ",args[3])
  var currentPath = process.cwd();
  var dir = "templates";
  let make_dir ;
  if (fs.existsSync(dir)){
    make_dir = 'templates/';
  }else {
    make_dir = currentPath+'/node_modules/genstruct/templates/';
  }
  container(name,make_dir);
  presentational(name,make_dir);
  index_presentational(name,make_dir);
  screen(name,make_dir);
  generate.on('finish', event => {
    console.log("Finished!",event.success)
})
}else{
  helper()
}

function helper(){
  
  console.log("Generate files");
  console.log("----------------");
  console.log("node genstruct -s NameScreen");

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
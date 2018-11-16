#! /usr/bin/env node
var fs = require('fs');
const generate = require('files-generator')();
//import ReactNative from 'src/ReactNative/ReactNative';
const Util =  require('./src/Util/Util');
const ReactNative = require('./src/ReactNative/ReactNative');
const args = process.argv;


init();

function init(){
  switch (args[2]) {
    case '-s':
      if (args[3] !== undefined){
        startGenerate(args);
      }
      else {
        infor()
      }
      break;
    case '-h':
      helper()
      break ;
    default:
      infor()
    break;
  }
}

function helper(){
  console.log("\x1b[31m Help:");
  console.log("\x1b[33m -s NameScreen (Generate screen ReactNative)");
}

function infor(){
  console.log("\x1b[32m","------------------------------");
  console.log("\x1b[34m     #### \x1b[37m Genstruct \x1b[34m ####");
  console.log("\x1b[32m","------------------------------");
  console.log("\x1b[1m  \x1b[5m \x1b[5m Help - genstruct -h");
  console.log("");
  console.log("");
}


function startGenerate(args){
  let name = args[3]
  util = new Util;
  reactNative = new ReactNative;
  util.getNodePath().then(function(path){
    var currentPath = process.cwd();
    var nodePath = path.replace(/\n/g, '');;
    var dir = "templates";
    let makeDir ;
    if (fs.existsSync(dir)){
      makeDir = 'templates/ReactNative/';
      console.log("GET TEMPLATE ROOT APP PATH");
    }else {
      if(fs.existsSync(nodePath)){
        console.log("GET TEMPLATE ROOT NODE PATH");
        makeDir = nodePath+'/genstruct/templates/ReactNative/';
      }else{
        console.log("GET TEMPLATE ROOT DEPENDENCE PATH");
        makeDir = currentPath+'/node_modules/genstruct/templates/ReactNative/';
      }
      
    }
    reactNative.container(name,makeDir);
    reactNative.presentational(name,makeDir);
    reactNative.index_presentational(name,makeDir);
    reactNative.screen(name,makeDir);
    
  }).catch(function(error){
   console.log(error)
});
}


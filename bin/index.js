#! /usr/bin/env node
const Screen = require('./src/react-native/screen');
const Reducer = require('./src/react-native/reducer');
const BoilerPlateServerless = require('./src/serverless/BoilerPlateServerless')
const args = process.argv;

init();

function init() {
  getApplication();
  // switch (args[2]) {
  //   case '-s':
  //     if (args[3] !== undefined) {
  //       screen = new Screen
  //       screen.generate(args)
  //     }
  //     else infor()
  //     break;
  //   case '-r':
  //     if (args[3] !== undefined) {
  //       reducer = new Reducer
  //       reducer.generate(args)
  //     }
  //     else infor()
  //     break;
  //   case '-h':
  //     helper()
  //     break ;
  //   default:
  //     infor()
  //   break;
  // }
}

function getApplication(){
  switch (args[2]) {
    case '-a':
      if (args[3] !== undefined) {
        getFunctionApplication(args[3],args[4])
      }
      else infor()
      break;
    case '-h':
      helper()
      break ;
    default:
      infor()
    break;
  }
}
function getFunctionApplication(application,func){
  console.log("Application",application)
  switch( application){
    case 'serverless':
      getFunctionServeless(func)
    break;
    default:
    break
  }
}

function getFunctionServeless(func){
  console.log("Application",func)
  switch(func){
    case 'init':
    boilerPlate = new BoilerPlateServerless
    boilerPlate.generate()
  break;
  default:
  break
  }
}
function helper(){
  console.log("\x1b[31m Help:");
  console.log("\x1b[33m genstruct -a react-native -s NameScreen (Generate screen react-native)");
  console.log("\x1b[33m genstruct -a react-native -r  NameReducer (Generate reducer react-native)");
  console.log("\x1b[33m genstruct -a serverless init (Generate Init code serverless)");
}

function infor(){
  console.log("\x1b[32m","------------------------------");
  console.log("\x1b[34m     #### \x1b[37m Genstruct \x1b[34m ####");
  console.log("\x1b[32m","------------------------------");
  console.log("\x1b[1m  \x1b[5m \x1b[5m Help - genstruct -h");
  console.log("");
  console.log("");
}

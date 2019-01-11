#! /usr/bin/env node
const Screen = require('./src/react-native/screen');
const Reducer = require('./src/react-native/reducer');
const args = process.argv;

init();

function init() {
  switch (args[2]) {
    case '-s':
      if (args[3] !== undefined) {
        screen = new Screen
        screen.generate(args)
      }
      else infor()
      break;
    case '-r':
      if (args[3] !== undefined) {
        reducer = new Reducer
        reducer.generate(args)
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
function helper(){
  console.log("\x1b[31m Help:");
  console.log("\x1b[33m -s NameScreen (Generate screen react-native)");
  console.log("\x1b[33m -r NameReducer (Generate reducer react-native)");
}

function infor(){
  console.log("\x1b[32m","------------------------------");
  console.log("\x1b[34m     #### \x1b[37m Genstruct \x1b[34m ####");
  console.log("\x1b[32m","------------------------------");
  console.log("\x1b[1m  \x1b[5m \x1b[5m Help - genstruct -h");
  console.log("");
  console.log("");
}

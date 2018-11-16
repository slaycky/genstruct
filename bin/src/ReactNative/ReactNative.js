var fs = require('fs');
const generate = require('files-generator')();
class ReactNative {
  
  container(name,dir){
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
  
  presentational(name,dir){
  
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
  index_presentational(name,dir){
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
  
  screen(name,dir){
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
}
module.exports = ReactNative;
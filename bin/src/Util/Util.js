
let cmd = require('node-cmd');

class Util {
  
 getNodePath(){
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
}
module.exports = Util
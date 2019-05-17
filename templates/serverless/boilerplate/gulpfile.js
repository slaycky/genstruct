var gulp = require("gulp");
var fs = require("fs");
var exec = require("child_process").execSync;
var argv = require("yargs").argv;


gulp.task("deploy_function", function() {
  exec(`mkdir -p build`, { stdio: [0, 1, 2] });
  exec(`cp -R services/${argv.function} build/${argv.function}`, {stdio: [0, 1, 2]});
  exec(`cp -R helpers/ build/${argv.function}`, { stdio: [0, 1, 2] });
  exec(`cp -R node_modules build/${argv.function}`, { stdio: [0, 1, 2] });
  exec(`cp -R config/config.json build/${argv.function}`, { stdio: [0, 1, 2] });
  // exec(`cp -R config/database.js build/${argv.function}`, { stdio: [0, 1, 2] }); 
  // exec(`cp -R config/databaseasync.js build/${argv.function}`, {stdio: [0, 1, 2]});
  exec(`cp -R package.json build/${argv.function}`, { stdio: [0, 1, 2] });
  let buildString = `cd build/${argv.function}
                     npm run deploy-production  `;
  exec(buildString, { stdio: [0, 1, 2] });
  // exec('rm -r build', { stdio: [0, 1, 2] });
});

gulp.task("default", function() {
  fs.readdir("services", function(err, filesPath) {
    if (err) throw err;
    result = filesPath.map(function(filePath) {
      return filePath;
    });

    result.forEach(folder => {
      exec(`cp -R services/${folder} build/${folder}`, { stdio: [0, 1, 2] });
      exec(`cp -R helpers/ build/${folder}/helpers`, { stdio: [0, 1, 2] });
      exec(`cp -R node_modules build/${folder}`, { stdio: [0, 1, 2] });
      exec(`cp -R config/config.json build/${folder}`, { stdio: [0, 1, 2] });
      // exec(`cp -R config/database.js build/${folder}`, { stdio: [0, 1, 2] });
      exec(`cp -R helpers/ build/${folder}`, { stdio: [0, 1, 2] });
      // exec(`cp -R config/database.write.js build/${folder}`, {
      //   stdio: [0, 1, 2]
      // });
      exec(`cp -R package.json build/${folder}`, { stdio: [0, 1, 2] });
        let buildString = `cd build/${folder}
                             npm run deploy-dev`;
        exec(buildString, { stdio: [0, 1, 2] });
    });
  });
});


// gulp deploy_function  --function nome da pasta onde esta a função

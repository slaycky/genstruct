var fs = require('fs')
var fse = require("fs-extra");
const Util = require('../util/util')
const generate = require('files-generator')()
var readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
class BoilerPlateServerless {
  async generate() {

    const self = this
    const util = new Util
    util.getNodePath().then(async function(path){
      var currentPath = process.cwd()
      var nodePath = path.replace(/\n/g, '')
      var dir = "templates"
      let makeDir
      if (fs.existsSync(dir)){
        makeDir = 'templates/serverless/boilerplate/'
      } else {
        if(fs.existsSync(nodePath)) makeDir = nodePath+'/genstruct/templates/serverless/boilerplate/'
        else makeDir = currentPath+'/node_modules/genstruct/templates/serverless/boilerplate/'
      }
      console.log("\x1b[33m ========================================");
      console.log("\x1b[31m Initialize boilerplate serveless:");
      console.log("\x1b[31m You should make sure this service is installed:");
      console.log("\x1b[33m sudo npm -g serverless");
      console.log("\x1b[33m sudo npm install sequelize-cli -g");
      console.log("\x1b[33m ========================================");

  
      let project_name = await self.ask("what is project name? ")
      util.executeCmd(`mkdir ${project_name}`)
      let git_repo = await self.ask("what is git repo? ")
      let service_codignito = await self.ask("Would you like to add cognito service to your project? (Y/N)")
      let database = await self.ask("Would you like to add some database to your project? \n 1 - Mysql \n 2 - Postgresql \n 3 - Redis \n 4 - No one \n")
     
      self.package(project_name,git_repo,makeDir)
      self.gulp(project_name,makeDir)
      self.structureFolders(project_name,makeDir)
      if (service_codignito.toUpperCase() === "Y"){
        self.scaffoldCognito(project_name,makeDir)
      }
      await self.addDatabase(project_name,database)
      self.sequelizeInit(project_name)
      //process.exit() 
    }).catch(function(error){
      console.log(error)
    })
   
  }
  package(project_name,git_repo,dir) {
    let file = dir+'package.json'
    console.log()
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/GIT_REPO/g, git_repo).replace(/PROJECT_NAME/g, project_name)
      console.log('PROJECT=>',project_name+'package.json')
      generate({ [project_name+'/package.json']: result })
    })
  }
  sequelizeInit(project_name){
    const util = new Util
    console.log("\x1b[34m     #### \x1b[37m Gerando arquivos do sequelize \x1b[34m ####")
    util.executeCmd(`cd ${project_name} && sequelize init`)
  }
  gulp(project_name,dir) {
    let file = dir+'gulpfile.js'
    console.log()
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data
      generate({ [project_name+'/gulpfile.js']: result })
    })
  }
  structureFolders(project_name,dir){
    fse.copy(dir+'/config', project_name+'/config', function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("config success copy!");
      }
    });
    fse.copy(dir+'/helpers', project_name+'/helpers', function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("helpers success copy!");
      }
    });
    fse.copy(dir+'/tests', project_name+'/tests', function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("tests success copy!");
      }
    });
  }
  scaffoldCognito(project_name,dir){
    fse.copy(dir+'/controllers', project_name+'/controllers', function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("user success copy!");
      }
    });
  }
  ask(questionText) {
    return new Promise((resolve, reject) => {
      readlineInterface.question(questionText, (input) => resolve(input) );
    });
  }
 async addDatabase(project_name,database){
    const util = new Util
    console.log('database select:',database)
    switch(database){
      case '1':
        await util.executeCmd(`cd ${project_name} && npm install mysql2 --save && npm install --save sequelize && npm install sequelize-cli --save `)
        break
      case '2':
         await util.executeCmd(`cd ${project_name} && npm install pg --save && npm install --save sequelize && npm install sequelize-cli --save `)
        break
      case '3':
         await util.executeCmd(`cd ${project_name} && npm install redis --save && npm install --save sequelize && npm install sequelize-cli --save `)
        break;
      default:
      break;
    }
  }
}

module.exports = BoilerPlateServerless
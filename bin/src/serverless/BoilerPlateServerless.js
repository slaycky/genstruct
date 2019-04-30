var fs = require('fs')
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
      console.log('Inicializando boilerplate serveless')
      let project_name = await self.ask("what is project name? ")
      let git_repo = await self.ask("what is git repo? ")
      self.package(project_name,git_repo,makeDir)
      self.gulp(project_name,makeDir)
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
  gulp(project_name,dir) {
   
    let file = dir+'gulpfile.js'
    console.log()
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data
      generate({ [project_name+'/gulpfile.js']: result })
    })
  }
  ask(questionText) {
    return new Promise((resolve, reject) => {
      readlineInterface.question(questionText, (input) => resolve(input) );
    });
  }
}

module.exports = BoilerPlateServerless
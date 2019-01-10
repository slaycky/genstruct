var fs = require('fs')
const Util = require('../util/util')
const generate = require('files-generator')()

class Reducer {
  generate(args) {
    const self = this
    let name = args[3]
    const util = new Util
    util.getNodePath().then(function(path){
      var currentPath = process.cwd()
      var nodePath = path.replace(/\n/g, '')
      var dir = "templates"
      let makeDir
      if (fs.existsSync(dir)){
        makeDir = 'templates/react-native/reducer/'
      } else {
        if(fs.existsSync(nodePath)) makeDir = nodePath+'/genstruct/templates/react-native/reducer/'
        else makeDir = currentPath+'/node_modules/genstruct/templates/react-native/reducer/'
      }
      self.reducer(name,makeDir)
      self.action(name,makeDir)
      self.useCase(name,makeDir)
    }).catch(function(error){
      console.log(error)
    })
  }


 reducer(name,dir) {
    let file = dir+'reducer.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase())
      generate({ ['src/reducers/'+name+'Reducer.js']: result })
    })
  }

 action(name,dir) {
    let file = dir+'action.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase())
      generate({ ['src/actions/'+name+'Action.js']: result })
    })
  }

 useCase(name,dir) {
    let file = dir+'useCase.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase())
      generate({ ['src/useCases/'+name+'UseCase.js']: result })
    })
  }
}
module.exports = Reducer
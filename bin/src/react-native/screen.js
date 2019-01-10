var fs = require('fs')
const Util = require('../util/util')
const generate = require('files-generator')()

class Screen {
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
        makeDir = 'templates/react-native/screen/'
      } else {
        if(fs.existsSync(nodePath)) makeDir = nodePath+'/genstruct/templates/react-native/screen/'
        else makeDir = currentPath+'/node_modules/genstruct/templates/react-native/screen/'
      }
      self.container(name,makeDir)
      self.presentational(name,makeDir)
      self.index_presentational(name,makeDir)
      self.screen(name,makeDir)
    }).catch(function(error){
      console.log(error)
    })
  }

 container(name,dir) {
    var file = dir+'container.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase())
      generate({ ['src/components/container/'+name+'Container.js']: result })
    })
  }

 presentational(name,dir) {
    let file = dir+'presentational.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase())
      generate({ ['src/components/presentational/'+name+'/'+name+'.js']: result })
    })
  }

 index_presentational(name,dir) {
    let file = dir+'index_presentational.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase()).replace(/NAMEREPLACE/g, name.toUpperCase())
      generate({ ['src/components/presentational/'+name+'/index.js']: result })
    })
  }

 screen(name,dir) {
    let file = dir+'screen.js'
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return console.log(err)
      const result = data.replace(/NameReplace/g, name).replace(/namereplace/g, name.toLowerCase())
      generate({ ['src/screens/'+name+'Screen.js']: result })
    })
  }
}
module.exports = Screen
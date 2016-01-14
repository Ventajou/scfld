// This is a hackish way to require globally installed modules.
// Inspired by the global-npm module.
// We use it to load npm as well as the plugins.

var error = require('./error.js');
var path = require('path');
var fs = require('fs');
var which = require('which');

var globalPath = [];

module.exports = function globalRequire(name) {
  if (!globalPath.length) {
    var npmBin;
    try {
      npmBin = process.env.GLOBAL_NPM_BIN || fs.realpathSync(which.sync('npm'));
    }
    catch (e) {
      error('npm could not be found');
    }

    globalPath.push(process.env.GLOBAL_NPM_PATH || path.join(
      npmBin,
      process.platform === "win32" ? '../node_modules' : '../../..'
    ));
    
    // Some Windows installs have npm in one place and
    // the npm global packages in another...
    // This attempts to find the second location.
    var execSync = require('child_process').execSync;
    var p = execSync('npm root -g').toString().trim();
    if (p != globalPath[0]) globalPath.push(p);
  }

  var m;
  var i = 0;
  while(!m && i < globalPath.length) {
    try {
      m = require(path.join(globalPath[i], name));
    }
    catch(e) {}
    i++;
  }
  return m;
}

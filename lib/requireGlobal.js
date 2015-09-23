// This is a hackish way to require globally installed modules.
// Inspired by the global-npm module.
// We use it to load npm as well as the plugins.

var error = require('./error.js');
var path = require('path');
var fs = require('fs');
var which = require('which');

var globalPath;

module.exports = function globalRequire(name) {
  if (!globalPath) {
    var npmBin;
    try {
      npmBin = process.env.GLOBAL_NPM_BIN || fs.realpathSync(which.sync('npm'));
    }
    catch (e) {
      error('npm could not be found');
    }

    globalPath = process.env.GLOBAL_NPM_PATH || path.join(
      npmBin,
      process.platform === "win32" ? '../node_modules' : '../../..'
    );
  }

  var m;
  try {
    m = require(path.join(globalPath, name));
  }
  catch(e) {}
  return m;
}

module.exports = function() {
  var pluginManager = require('../pluginManager.js');
  var _ = require('lodash');

  pluginManager
    .list()
    .then(function(plugins) {
      if (plugins.length) {
        console.log('\n  Plugins installed:\n');
        _.forEach(plugins, function(p) {
          console.log('  ' + p.name.substr(6) + '\t\t' + p.description);
        });
        console.log();
      }
      else {
        console.log('  There are no plugins installed, use scfld search to see available plugins.');
      }
    });
};

module.exports = function() {
  var pluginManager = require('../pluginManager.js');
  var _ = require('lodash');

  console.log('\n  Retrieving the packages list, this may take some time...');

  pluginManager
    .list()
    .then(function(plugins) {
      if (plugins.length) {
        console.log('\033[1A\033[K  Plugins installed:\n');
        _.forEach(plugins, function(p) {
          console.log('  ' + p.name.substr(6) + '\t\t' + p.description);
        });
        console.log();
      }
      else {
        console.log('  There are no plugins installed, use npm to install some.');
      }
    });
};

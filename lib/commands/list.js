module.exports = function() {
  var pluginManager = require('../pluginManager.js');
  var _ = require('lodash');
  var columnFormat = require("column-layout")

  console.log('\n  Retrieving the packages list, this may take some time...');

  pluginManager
    .list()
    .then(function(plugins) {
      if (plugins.length) {
        console.log('\033[1A\033[K  Plugins installed:\n');
        var data = _.map(plugins, function(p) {
          return { name: p.name.substr(6), desc: p.description }
        });
        console.log(columnFormat(data, {padding: {left: '  '}}));
        console.log();
      }
      else {
        console.log('  There are no plugins installed, use npm to install some.');
      }
    });
};

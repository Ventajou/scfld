module.exports = function (pluginName) {
  var pluginManager = require('../pluginManager.js');
  var error = require('../error.js');
  pluginManager.load(pluginName).then(function (plugin) {
    if (!plugin) error('Could not load the plugin: ' + pluginName);
    if (!plugin.init) error(pluginName + ' is not a compatible plugin.');

    plugin.init().then(function (template) {
      var scaffold = require('scaffold-generator')(template.options);
      var _ = require('lodash');
      _.forEach(template.sources, function (s) {
        scaffold.copy(s, process.cwd(), function(er) {
          if (er) error(er);
        });
      });
      pluginManager
        .installDeps(template.globalDeps)
        .then(function() {
          var execSync = require('child_process').execSync;
          _.forEach(template.postInit, function(cmd) {
            console.log('  Running post init command: ' + cmd);
            execSync(cmd);
          });
        });
    });
  });
};

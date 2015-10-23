module.exports = function (pluginName) {
  var pluginManager = require('../pluginManager.js');
  var error = require('../error.js');
  var clc = require('cli-color');

  pluginManager.load(pluginName).then(function (plugin) {
    if (!plugin) error('Could not load the plugin: ' + pluginName);
    if (!plugin.init) error(pluginName + ' is not a compatible plugin.');

    console.log(clc.cyan('\n  Initializing new ' + pluginName + ' project.'));

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
          var spawnSync = require('child_process').spawnSync;
          _.forEach(template.postInit, function(c) {
            console.log('  Running post init command: ' + c.cmd + ' ' + c.args.join(' '));
            var r = spawnSync(c.cmd, c.args);
            console.log(r.status)
          });
        });
    });
  });
};

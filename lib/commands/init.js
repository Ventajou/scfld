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
      var Q = require('q');

      var p = Q.all(_.map(template.sources, function (s) {
        var q = Q.defer();
        scaffold.copy(s, process.cwd(), function (er) {
          if (er) q.reject(er);
          else q.resolve();
        });
        return q.promise;
      }));

      p.then(function () {
        pluginManager
          .installDeps(template.globalDeps)
          .then(function () {
            if (template.postInit && template.postInit.length) {
              console.log('\n  Running post init commands:');
              var execSync = require('child_process').execSync;
              _.forEach(template.postInit, function (c) {
                console.log('  - ' + c);
                var output;
                try {
                  output = execSync(c, {stdio: [null]});
                }
                catch(e) {
                  error('There was an error while running the command.');
                  process.exit(1);
                }
              });
            }
            console.log(clc.green('\n  Your project is ready!\n'));
          });
      }, function (er) {
        error(er);
      });
    });
  });
};

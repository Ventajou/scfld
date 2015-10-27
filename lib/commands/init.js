var fs = require('fs');
var Q = require('q');
var inquirer = require('inquirer');
var _ = require('lodash');

function checkFolder() {
  var q = Q.defer();
  var files = fs.readdirSync(process.cwd());
  if (files.length > 0) {
    inquirer.prompt([{
      type: 'expand',
      message: 'The current folder is not empty, what would you like to do?',
      name: 'clean',
      choices: [
        {
          key: 'e',
          name: 'Empty the folder',
          value: 'empty'
        },
        {
          key: 'l',
          name: 'Leave the files and continue',
          value: 'leave'
        },
        {
          key: 'c',
          name: 'Cancel',
          value: 'cancel'
        }
      ]
    }], function(answers) {
      switch(answers.clean) {
        case 'cancel':
          process.exit();
          break;
        case 'empty':
          var del = require('del');
          var path = require('path');
          del.sync([path.join(process.cwd(), '/**'), path.join(process.cwd(), '/.*'), '!' + process.cwd()]);
          break;
        case 'cancel':
          q.reject();
          break;
      }
      q.resolve();
    });
  }
  else q.resolve();

  return q.promise;
}

function expandTemplate(template) {
  var scaffold = require('scaffold-generator')(template.options);

  var p = Q.all(_.map(template.sources, function (s) {
    var q = Q.defer();
    scaffold.copy(s, process.cwd(), function (er) {
      if (er) q.reject(er);
      else q.resolve();
    });
    return q.promise;
  }));

  return p;
}

module.exports = function (pluginName) {
  var pluginManager = require('../pluginManager.js');
  var error = require('../error.js');
  var clc = require('cli-color');

  pluginManager.load(pluginName).then(function (plugin) {
    if (!plugin) error('Could not load the plugin: ' + pluginName);
    if (!plugin.init) error(pluginName + ' is not a compatible plugin.');

    var template;

    checkFolder()
      .then(function() {
        console.log(clc.cyan('\n  Initializing new ' + pluginName + ' project.'));
        return plugin.init();
      })
      .then(function(t) {
        template = t;
        return expandTemplate(t);
      })
      .then(function () {
        return pluginManager.installDeps(template.globalDeps);
      })
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
      }, function (er) {
        if (er) error(er);
      });
  });
};

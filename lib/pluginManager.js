var Q = require('q');
var requireGlobal = require('./requireGlobal.js');
var error = require('./error.js');
var _ = require('lodash');
var npm = requireGlobal('npm');
if (!npm) error('Could not load npm.');

var npmDeferred = Q.defer();

npm.load({global: true}, function(er, npm) {
  if (er) error('Could not load npm.');
  npmDeferred.resolve(npm);
});

function list() {
  var q = Q.defer();
  npmDeferred.promise.then(function(npm) {
    npm.commands.ls(null, true, function(er, fullDeps, deps) {
      if (er) error('Could not retrieve plugins from npm');
      var plugins = _.filter(fullDeps.dependencies, function(v, k) { return k.indexOf('scfld-') == 0; })
      q.resolve(plugins);
    });
  });
  return q.promise;
}

function load(name) {
  var q = Q.defer();
  if (!name || !name.length) {
    q.resolve(null);
  }
  else {
    npmDeferred.promise.then(function(npm) {
      q.resolve(requireGlobal('scfld-' + name));
    });
  }
  return q.promise;
}

function installDeps(deps) {
  var q = Q.defer();
  if (!deps || !deps.length) {
    q.resolve();
  }
  else {
    npmDeferred.promise.then(function(npm) {
      npm.commands.ls(null, true, function(er, fullDeps) {
        if (er) error('Could not retrieve plugins from npm');
        var missing = _.difference(deps, _.keys(fullDeps.dependencies));
        if (missing.length) {
          console.log('  Installing the following global dependencies: ' + missing.join(', '));
          npm.commands.install(missing, function() {
            q.resolve();
          });
        }
        else q.resolve();
      });
    });
  }
  return q.promise;
}

module.exports = {
  // Returns the list of installed plugins
  list: list,
  load: load,
  installDeps: installDeps
}
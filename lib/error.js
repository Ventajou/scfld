var clc = require('cli-color');

module.exports = function throwError(msg) {
  console.log('  ' + clc.red.bold(msg) + '\n');
  process.exit(1);
}

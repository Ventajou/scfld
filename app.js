#!/usr/bin/env node
var program = require('commander');
var clc = require('cli-color');

console.log(clc.blue.bold('\n  Scfld - quick project scaffolding'));

program
  .version('0.0.1');

program
  .command('list')
  .alias('ls')
  .description('list the available plugins')
  .action(require('./lib/commands/list.js'));

program
  .command('init <name>')
  .description('initializes a new project using the given plugin')
  .action(require('./lib/commands/init.js'));

program.parse(process.argv);
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

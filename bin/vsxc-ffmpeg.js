#!/usr/bin/env node

const figlet = require('figlet');
const { panic } = require('../src/utils');
const { name, version } = require('../package.json');

(function () {
  figlet(name.toUpperCase(), function (err, data) {
    if (err) throw err;

    console.log(data, `\n${name} | v${version}`);
    console.log(`\n[${new Date().toLocaleString()}] ${process.cwd()}`);

    try {
      require('../src/index.js');
    } catch (err) {
      panic(err);
    }
  });
})();

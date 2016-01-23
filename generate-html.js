'use strict';

var fs = require('fs'),
  Mustache = require('mustache'),
  Q = require('q'),
  template;


template = fs.readFileSync('templates/index.html').toString();

function generateHtml() {
  return Q.nfcall(fs.readdir, 'public/photos').then(function(files) {
    var sortedFiles = files.filter(function(file) {
        return file[0] !== '.';
      }).sort().reverse(),
      html = Mustache.render(template, {
        files: sortedFiles,
        year: (new Date()).getFullYear()
      });

    return Q.nfcall(fs.writeFile, 'public/index.html', html);
  });
}

module.exports = generateHtml;
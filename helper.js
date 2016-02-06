'use strict';

var fs = require('fs'),
  imageHelper = require('./image-helper'),
  generateHtml = require('./generate-html'),
  Q = require('q');



fs.readdir('tmp', function(err, files) {
  var promises = [];

  if(err) {
    console.error('error opening director:', err);
    return;
  }

  files.forEach(function(filename) {
    if(filename[0] === '.') {
      return;
    }

    promises.push(imageHelper.finalizeImage('tmp/'+filename, filename)
      .then(function() {
        console.log('generated:', filename);
      }, function(err) {
          console.error('error finalizing image:', 'tmp/'+filename, err);
      }));
  });

  Q.all(promises)
    .then(generateHtml)
    .then(function() {
      console.log('all done');
    })
    .done();
});
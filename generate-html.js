'use strict';

var fs = require('fs'),
  Mustache = require('mustache'),
  Q = require('q'),
  indexTemplate,
  imageTemplate;


indexTemplate = fs.readFileSync('templates/index.html').toString();
imageTemplate = fs.readFileSync('templates/image.html').toString();

function generateHtml() {
  return Q.nfcall(fs.readdir, 'public/photos').then(function(files) {
    var sortedFiles,
      indexHtml,
      imageFilesPromise,
      year = (new Date()).getFullYear();

    sortedFiles = genObjects(files.filter(function(file) {
        return !(file[0] === '.' || file === 'large' || /\.html$/.test(file));
      }).sort().reverse());

      imageFilesPromise = sortedFiles.map(function(image) {
        var imageHtml = Mustache.render(imageTemplate, {
          image: image.image,
          year: year
        });

        return Q.nfcall(fs.writeFile, 'public/photos/' + image.imageHtml, imageHtml);
      });
      indexHtml = Mustache.render(indexTemplate, {
        files: sortedFiles,
        year: year
      });

    return Q.all(imageFilesPromise)
      .then(Q.nfcall(fs.writeFile, 'public/index.html', indexHtml));
  });
}

function genObjects(files) {
  return files.map(function(imageFile) {
    var base = imageFile.substr(0, imageFile.lastIndexOf('.'));

    return {
      image: imageFile,
      imageHtml: base + ".html"
    };
  });
}

module.exports = generateHtml;
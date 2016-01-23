'use strict';

var fs = require('fs'),
  request = require('request'),
  gm = require('gm'),
  Q = require('q');


function saveImage(url, filename) {
  return Q.ninvoke(request(url).pipe(fs.createWriteStream(filename)), 'on', 'close');
}

function finalizeImage(tmpFile, filename) {
  var offset = 4,
    strokeWidth = 3,
    size = 400,
    outputFile = 'public/photos/' + filename;

  return Q.ninvoke(gm(tmpFile)
    .autoOrient()
    .resize(size, size, '!')
    .stroke('#fff', strokeWidth)
    .fill('#ffff')
    .drawPolygon(
      [offset + strokeWidth/2, offset + strokeWidth/2],
      [size - offset - strokeWidth/2 - 1, offset + strokeWidth/2],
      [size - offset - strokeWidth/2 - 1, size - offset - strokeWidth/2 - 1],
      [offset + strokeWidth/2, size - offset - strokeWidth/2 - 1]
    ),
    'write', outputFile);
}

module.exports = {
  saveImage: saveImage,
  finalizeImage: finalizeImage
};
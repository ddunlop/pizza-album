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

  console.log('here!', tmpFile);

  // gm(tmpFile).size(function(err, value) {
  //   if(err) {
  //     console.log('err: ', err);
  //   }
  //   console.log('callback - value:', value);
  // })
  return Q.ninvoke(gm(tmpFile), 'size')
  .then(function(value) {
    var minSide = Math.min(value.width, value.height),
      offsetX = 0,
      offsetY = 0;

    if(value.width > value.height) {
      offsetX = (value.width - value.height) / 2;
    }
    else {
      offsetY = (value.height - value.width) / 2;
    }

    return Q.ninvoke(gm(tmpFile)
    .autoOrient()
    .crop(minSide, minSide, offsetX, offsetY)
    .resize(size, size)
    .stroke('#fff', strokeWidth)
    .fill('#ffff')
    .drawPolygon(
      [offset + strokeWidth/2, offset + strokeWidth/2],
      [size - offset - strokeWidth/2 - 1, offset + strokeWidth/2],
      [size - offset - strokeWidth/2 - 1, size - offset - strokeWidth/2 - 1],
      [offset + strokeWidth/2, size - offset - strokeWidth/2 - 1]
    ),
    'write', outputFile);
  });
}

module.exports = {
  saveImage: saveImage,
  finalizeImage: finalizeImage
};
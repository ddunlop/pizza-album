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
    gImage,
    largeOutputFile = 'public/photos/large/' + filename,
    outputFile = 'public/photos/' + filename;

  console.log('generating from', tmpFile);

  gImage = gm(tmpFile);

  return Q.ninvoke(gImage.autoOrient(), 'size')
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

    gImage
      .autoOrient()
      .crop(minSide, minSide, offsetX, offsetY)
      .resize(size * 3, size * 3);

    return Q.ninvoke(gImage, 'write', largeOutputFile).then(function() {
      console.log('large image generated', largeOutputFile);
      return Q.ninvoke(gImage
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
        ), 'write', outputFile);
    });
  });
}

module.exports = {
  saveImage: saveImage,
  finalizeImage: finalizeImage
};
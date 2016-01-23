var express = require('express'),
  bodyParser = require('body-parser'),
  moment = require('moment'),
  uuid = require('uuid'),
  config = require('./config'),
  imageHelper = require('./image-helper'),
  generateHtml = require('./generate-html'),
  app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/', function (req, res) {
  var image = req.body,
    tmpFile,
    filename;

  if(config.secret !== image.secret) {
    res.sendStatus(404);
    return;
  }

  console.log('webhook:', JSON.stringify(image));
  res.sendStatus(201);

  standardizeData(image);

  filename = generateFilename(image);
  tmpFile = 'tmp/' + filename;


  imageHelper.saveImage(image.photo_url, tmpFile)
    .then(function() {
      return imageHelper.finalizeImage(tmpFile, filename);
    })
    .then(generateHtml)
    .then(function() {
      console.log('done generating html!');
    })
    .catch(function (error) {
      console.error('Error:', error);
    })
    .done();
});

generateHtml()
  .then(function() {
    app.listen(config.port, function () {
      console.log('Listening on port '+ config.port + '!');
    });
  });

function standardizeData(image) {
  image.date = moment(image.date,  'MMMM D, YYYY H:mA');
}

function generateFilename(image) {
  return image.date.format('YYYY-MM-DD_HH-mm-ss-') + uuid.v4() + '.jpg';
}
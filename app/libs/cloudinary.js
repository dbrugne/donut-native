'use strict';
var _ = require('underscore');
var debug = require('./debug')('cloudinary');
var sha1 = require('sha1');

// @conf
var config = {
  cloud_name: 'roomly',
  api_key: '962274636195222',
  api_secret: 'ayS9zUnK7sDxkme4sLquIPOmNVU'
};

var upload = function (fileBase64, tags, callback) {
  var url = 'https://api.cloudinary.com/v1_1/' + config.cloud_name + '/image/upload';
  var header = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  var timestamp = Date.now();

  var values = {
    file: 'data:image/png;base64,' + fileBase64,
    api_key: config.api_key,
    timestamp: timestamp,
    tags: tags,
    signature: sha1("tags=" + tags + "&timestamp=" + timestamp + config.api_secret)
  };
  var request = _.extend({
    body: JSON.stringify(values)
  }, header);

  fetch(url, request)
    .then((response) => response.json())
    .then((data) => {
      debug.log(data);
      callback(null, data);
    })
    .catch((err) => { callback(new Error(err)) });
};

module.exports = {config: config, upload: upload};

'use strict';
var _ = require('underscore');
var sha1 = require('sha1');
var RNFS = require('react-native-fs');

var config = {
  cloud_name: 'roomly',
  api_key: '962274636195222',
  api_secret: 'ayS9zUnK7sDxkme4sLquIPOmNVU'
};

var upload = function (filepath, callback) {
  var url = 'https://api.cloudinary.com/v1_1/' + config.cloud_name + '/image/upload';
  var fileBase64 = '';
  var header = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  var tags = 'user,avatar';
  var timestamp = Date.now();

  RNFS.readFile(filepath, 'base64').then((data) => {
    fileBase64 = 'data:image/png;base64,' + data;
    console.log(fileBase64);

    var values = {
      file: fileBase64,
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
        console.log('=> ajax', data)
        callback(null, data);
      })
      .catch((err) => { callback(new Error(err)) });
  }).catch(err => callback(new Error(err)));
};

module.exports = {config: config, upload: upload};
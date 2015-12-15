'use strict';
var React = require('react-native');
var Alert = require('./alert');
var cloudinary = require('./cloudinary');
var _ = require('underscore');

var {
  NativeModules
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'take': 'Take a picture',
  'choose': 'Choose from gallery',
  'uploading': 'uploading ...'
});

let { UIImagePickerManager: ImagePickerManager } = NativeModules;

var exports = module.exports = {};

exports.pickImage = function (callback) {
  ImagePickerManager.showImagePicker({
    maxWidth: 500,
    maxHeight: 500,
    takePhotoButtonTitle: i18next.t('local:take'),
    chooseFromLibraryButtonTitle: i18next.t('local:chose')
  }, (cancelled, response) => {
    return callback(cancelled, response);
  });
};

exports.uploadToCloudinary = function (base64File, tags, preset, callback) {
  Alert.show(i18next.t('local:uploading'));
  cloudinary.upload(base64File, tags, preset, (err, data) => {
    if (data && data.error) {
      return callback(data.error.message);
    } else if (err) {
      return callback(err);
    }

    var pathSplit = data.url.split('/');
    return callback (null, {
      public_id: data.public_id,
      version: data.version,
      path: data.url.replace('http://res.cloudinary.com/roomly/image/upload/', ''),
      type: data.resource_type,
      filename: pathSplit[pathSplit.length - 1].replace('.jpg', ''),
      size: (data.bytes >= 1000000)
        ? (data.bytes / 1000000).toFixed(2) + ' Mb'
        : (data.bytes >= 1000)
        ? (data.bytes / 1000).toFixed(2) + ' Kb'
        : data.bytes + ' b.'
    });
  });
};

exports.getImageAndUpload = function (tags, preset, callback) {
  this.pickImage((canceled, response) => {
    if (canceled) {
      return callback(null, null);
    }

    this.uploadToCloudinary(response.data, tags, preset, callback);
  });
};
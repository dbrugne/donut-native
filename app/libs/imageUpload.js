'use strict';
var React = require('react-native');
var Alert = require('./alert');
var cloudinary = require('./cloudinary');

var {
  NativeModules
  } = React;

let { UIImagePickerManager: ImagePickerManager } = NativeModules;

var exports = module.exports = {};

exports.pickImage = function (callback) {
  ImagePickerManager.showImagePicker({
    maxWidth: 500,
    maxHeight: 500,
    takePhotoButtonTitle: 'Take a picture',
    chooseFromLibraryButtonTitle: 'Choose from gallery'
  }, (cancelled, response) => {
    return callback(cancelled, response);
  });
};

exports.uploadToCloudinary = function (base64File, tags, callback) {
  Alert.show('uploading ...');
  cloudinary.upload(base64File, tags, (err, data) => {
    if (data && data.error) {
      return callback(data.error.message);
    } else if (err) {
      return callback(err);
    }

    var pathSplit = data.url.split('/');
    return callback (null, {
      public_id: data.public_id,
      version: data.version,
      path: pathSplit[pathSplit.length - 2] + '/' + pathSplit[pathSplit.length - 1]
    });
  });
};

exports.getImageAndUpload = function (tags, callback) {
  this.pickImage((canceled, response) => {
    if (canceled) {
      return callback(null, null);
    }

    this.uploadToCloudinary(response.data, tags, callback);
  });
};
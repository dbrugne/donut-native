'use strict';
var React = require('react-native');
var cloudinary = require('./cloudinary');

var {
  NativeModules,
  Alert,
  Platform
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'imageUpload', {
  'description': 'Upload image from',
  'take': 'Camera',
  'choose': 'Gallery',
  'uploading': 'uploading ...',
  'cancel': 'Cancel'
});

let { UIImagePickerManager: ImagePickerManager } = NativeModules;

var exports = module.exports = {};

exports.pickImage = function (callback) {
  var options = {
    takePhotoButtonTitle: i18next.t('imageUpload:take'),
    chooseFromLibraryButtonTitle: i18next.t('imageUpload:choose')
  };

  if (Platform.OS === 'android') {
    Alert.alert(
      null,
      i18next.t('imageUpload:description'),
      [
        {
          text: i18next.t('imageUpload:take'),
          onPress: () => ImagePickerManager.launchCamera(options, (response) => {
            return callback(response, 'camera');
          })
        },
        {
          text: i18next.t('imageUpload:choose'),
          onPress: () => ImagePickerManager.launchImageLibrary(options, (response) => {
            return callback(response, 'library');
          })
        }
      ]
    );
  } else {
    Alert.alert(
      null,
      i18next.t('imageUpload:description'),
      [
        {
          text: i18next.t('imageUpload:take'),
          onPress: () => ImagePickerManager.launchCamera(options, (response) => {
            return callback(response, 'camera');
          })
        },
        {
          text: i18next.t('imageUpload:choose'),
          onPress: () => ImagePickerManager.launchImageLibrary(options, (response) => {
            return callback(response, 'library');
          })
        },
        {
          text: i18next.t('imageUpload:cancel'),
          onPress: () => {}
        }
      ]
    );
  }
};

exports.uploadToCloudinary = function (base64File, tags, preset, callback) {
  cloudinary.upload(base64File, tags, preset, (err, data) => {
    if (data && data.error) {
      return callback(data.error.message);
    } else if (err) {
      return callback(err);
    }

    var pathSplit = data.url.split('/');
    return callback(null, {
      public_id: data.public_id,
      version: data.version,
      path: data.url.replace('http://res.cloudinary.com/roomly/image/upload/', ''),
      type: data.resource_type,
      width: data.width,
      height: data.height,
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
  this.pickImage((response) => {
    if (response.didCancel) {
      return callback(null, null);
    }

    this.uploadToCloudinary(response.data, tags, preset, callback);
  });
};
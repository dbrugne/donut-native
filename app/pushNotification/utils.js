var async = require('async');
var config = require('./../libs/config')();
var currentUser = require('../models/current-user');
var storage = require('./../libs/storage');
var Platform = require('Platform');

var debug = require('./../libs/debug')('pushNotification');

module.exports = {
  registerInstallation (deviceToken) {
    var installation = {
      appIdentifier: config.parse.appIdentifier,
      appName: config.parse.appName,
      appVersion: config.version,
      deviceType: Platform.OS,
      deviceToken: deviceToken,
      channels: ['global'],
      uid: currentUser.getId(),
      env: config.DONUT_ENVIRONMENT
    };

    var parseRequest = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': config.parse.appId,
        'X-Parse-REST-API-Key': config.parse.restApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(installation)
    };

    async.series([

      // store deviceToken only for debugging purpose
      (cb) => storage.setKey('deviceToken', deviceToken, cb),

      // parse
      (cb) => {
        debug.log('registerInstallation', config.parse.url, installation);
        fetch(config.parse.url, parseRequest)
          .then((response) => {
            return response.json()
          })
          .then((response) => {
            debug.log('parse registration response', response);
            storage.setKey('parse.objectId', response.objectId, (err) => {
              if (err) {
                debug.warn(err);
              }
            });
          })
          .then(() => cb(null))
          .catch((err) => cb(err));
      },

      // donut
      (cb) => currentUser.registerDevice(deviceToken, installation, cb)

    ], (err) => {
      if (err) {
        debug.warn('registerInstallation error', err);
      }

      debug.log('registerInstallation succeed');
    });
  }
};

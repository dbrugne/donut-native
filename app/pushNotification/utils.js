var config = require('./../libs/config')();
var currentUser = require('../models/current-user');
var storage = require('./../libs/storage');
var Platform = require('Platform');

var debug = require('./../libs/debug')('notifications');

module.exports = {
  registerInstallation (deviceToken) {
    // store deviceToken only for debugging purpose
    storage.setKey('deviceToken', deviceToken, (err) => {
      if (err) {
        debug.warn(err);
      }

      var data = {
        appIdentifier: config.parse.appIdentifier,
        appName: config.parse.appName,
        appVersion: config.version,
        deviceType: Platform.OS,
        deviceToken: deviceToken,
        channels: ['global'],
        uid: currentUser.getId(),
        env: config.DONUT_ENVIRONMENT
      };

      debug.log('registerInstallation', config.parse.url, data);
      fetch(config.parse.url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'X-Parse-Application-Id': config.parse.appId,
          'X-Parse-REST-API-Key': config.parse.restApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => debug.log(response))
        .catch(err);
    });
  }
};
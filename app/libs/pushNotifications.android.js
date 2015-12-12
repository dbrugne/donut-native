'use strict';

// @doc : https://parse.com/docs/rest/guide/#push-notifications-installations

// @todo : what's happen if multiple Parse registration?
// @todo : need to bind installation to user id (so only on (first?) ws connect)

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;

var app = require('./app');
var config = require('./config')();
var debug = require('./debug')('notifications');
var currentUser = require('../models/mobile-current-user');

module.exports = {
  componentDidMount () {
    this._registerDevice();
  },
  componentWillUnmount () {
    // @todo yfuks : ParseManagerAndroid.unsubscribeToChannel ??
  },
  _registerDevice() {
    ParseManagerAndroid.authenticate((err) => {
      if (err) {
        return debug.warn(err);
      }
      ParseManagerAndroid.subscribeToChannel('global', (err) => {
        if (err) {
          return debug.warn(err);
        }
        this._setUid();
      });
    });
  },
  _setUid () {
    ParseManagerAndroid.getId((ID_TO_RENAME) => { // @todo : ID_TO_RENAME what is it? deviceToken, installationId, ... ??
      fetch(config.parse.url + ID_TO_RENAME, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'X-Parse-Application-Id': config.parse.appId,
          'X-Parse-Master-Key': config.parse.masterKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: currentUser.getId()
        })
      })
        .then((response) => debug.log(response)) // @todo : maybe something to save in local storage from response? (to save use storage.setKey('key', 'value', callback))
        .catch((err) => debug.log(err));
    });
  },
};

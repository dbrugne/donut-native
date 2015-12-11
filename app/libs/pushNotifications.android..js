'use strict';

// @doc : https://parse.com/docs/rest/guide/#push-notifications-installations

// @todo : what's happen if multiple Parse registration?
// @todo : need to bind installation to user id (so only on (first?) ws connect)

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;

var _ = require('underscore');
var debug = require('./debug')('notifications');
var app = require('./app');
var currentUser = require('../models/mobile-current-user');

var PushNotifications = {
  componentDidMount: _.noop,
  componentWillUnmount: _.noop
};

module.exports = {
  componentDidMount () {
    this._registerDevice();
  },
  componentWillUnmount () {

  },
  _setUid () {
    ParseManagerAndroid.getId((id) => {
      var url = 'https://api.parse.com/1/installations/' + id;

      fetch(url, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'X-Parse-Application-Id': 'HLZpzyuliql75EGfdH1o9En9VwDIp4h8KmRHaQ9g', // @conf
          'X-Parse-Master-Key': '7c6ycSLa7gBHzQ9w2KMJBKoVWrVwBw8606x7PtVA', // @conf
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: currentUser.getId()
        })
      })
      .then((response) => debug.log(response))
      .catch((err) => debug.log(err));
    });
  },
  _registerDevice() {
    ParseManagerAndroid.authenticate((err) => {
      if (err) {
        return debug.log(err);
      }
      ParseManagerAndroid.subscribeToChannel('global', (err) => {
        if (err) {
          return debug.log(err);
        }
        this._setUid();
      });
    });
  }
};

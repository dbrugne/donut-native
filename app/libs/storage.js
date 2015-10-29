'use strict';

var React = require('react-native');
var {
  AsyncStorage
  } = React;

var _ = require('underscore');

var LocalKeyStore = {
  getKey: function (keyName, callback) {
    AsyncStorage.getItem(keyName, function (err, value) { // callback: error, value
      if (err) {
        console.log('Error getting item (' + keyName + ') from local storage! ' + err.message);
        if (callback) {
          callback(err, null);
        }
      } else {
        if (callback) {
          callback(null, value);
        }
      }
    });
  },
  setKey: function (keyName, value, callback) { // callback: error
    AsyncStorage.setItem(keyName, value, function (err) {
      if (err) {
        console.log('Error setting item (' + keyName + ') to local storage! ' + err.message);
        if (callback) {
          callback(err);
        }
      } else {
        if (callback) {
          callback(null);
        }
      }
    });
  },
  getKeys: function (keys, callback) {
    AsyncStorage.multiGet(keys, function (err, values) {
      if (err) {
        callback(err);
      }

      var data = {};
      _.each(values, function (element) {
        data[ element[ 0 ] ] = element[ 1 ];
      });
      callback(null, data);
    });
  },
  setKeys: function (values, callback) {
    var data = [];
    _.each(values, function (value, key) {
      data.push([ key, value ]);
    });

    AsyncStorage.multiSet(data, callback);
  }
};

module.exports = LocalKeyStore;

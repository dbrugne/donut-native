'use strict';

var React = require('react-native');
var {
  AsyncStorage
  } = React;

var _ = require('underscore');

var Storage = {
  getKey: function (keyName, callback) {
    callback = callback || _.noop;
    AsyncStorage.getItem(keyName, function (err, value) { // callback: error, value
      if (err) {
        console.log('Error getting item (' + keyName + ') from local storage! ' + err.message);
        callback(err, null);
      } else {
        console.log('returning value', value);
        callback(null, value);
      }
    });
  },
  setKey: function (keyName, value, callback) {
    callback = callback || _.noop;

    if (!value) {
      return this.removeKey(keyName, callback);
    }

    AsyncStorage.setItem(keyName, value, function (err) {
      if (err) {
        console.log('Error setting item (' + keyName + ') in local storage! ' + err.message);
        callback(err);
      } else {
        callback(null);
      }
    });
  },
  removeKey: function (key, callback) {
    callback = callback || _.noop;
    AsyncStorage.removeItem(key, function (err) {
      if (err) {
        console.log('Error removing item (' + key + ') from local storage! ' + err.message);
        callback(err);
      } else {
        callback(null);
      }
    });
  },
  getKeys: function (keys, callback) {
    callback = callback || _.noop;
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
    callback = callback || _.noop;
    var keysToSave = [];
    var keysToRemove = [];

    _.each(values, function (value, key) {
      if (!value) {
        keysToRemove.push(key);
        return;
      }

      keysToSave.push([key, value]);
    });

    var save = function (cb) {
      if (!keysToSave.length) {
        return cb(null);
      }
      AsyncStorage.multiSet(keysToSave, cb);
    };
    var remove = function (cb) {
      if (!keysToRemove.length) {
        return cb(null);
      }
      AsyncStorage.multiRemove(keysToRemove, cb);
    };

    save(function (err) {
      if (err) {
        console.warn(err);
      }

      remove(callback);
    })
  },
  removeKeys: function (keys, callback) {
    callback = callback || _.noop;
    AsyncStorage.multiRemove(keys, function (err) {
      if (err) {
        console.log('Error removing item (' + key + ') from local storage! ' + err.message);
        callback(err);
      } else {
        callback(null);
      }
    });
  }

  // @todo : implement removeKeys, use it in setKeys, replace all usage in code
};

module.exports = Storage;

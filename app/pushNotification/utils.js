var async = require('async');
var config = require('./../libs/config')();
var currentUser = require('../models/current-user');
var storage = require('./../libs/storage');
var Platform = require('Platform');
var oauth = require('../libs/oauth');

var debug = require('./../libs/debug')('pushNotification');

module.exports = {
  register (parseObjectId) {
    oauth._registerDevice(parseObjectId, (err) => {
      if (err) {
        return debug.warn(err);
      }
      debug.log('Device id register to ws : ' + parseObjectId);
    });
  }
};

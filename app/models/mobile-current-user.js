var _ = require('underscore');
var client = require('../libs/client'); // @mobile
var currentUser = require('./current-user');

// @todo:  that is works? that is needed?
currentUser.defaults = function () {
  return {
    token: null,
    code: null,
    unviewed: 0
  };
};

currentUser.oauth = require('../libs/oauth');

currentUser.loadInitialState = function () {
  this.oauth.loadStorage(_.bind(function () {
    this.oauth.checkStatus(_.bind(function (err) {
      if (err) {
        console.warn(err);
      }

      // trigger LoggedOut navigation tree
      this.trigger('currentUserStatus');
    }, this));
  }, this));
};

currentUser.isLoggedIn = function () {
  return (this.oauth.loaded && this.oauth.token);
};

currentUser.getEmail = function () {
  return this.oauth.email;
};

currentUser.getToken = function () {
  return this.oauth.token;
};

currentUser.isAdmin = function () {
  return (this.get('admin') === true);
};

currentUser.login = function (email, password, callback) {
  this.oauth.login(email, password, _.bind(function (err) {
    if (err) {
      return callback(err);
    }

    this.trigger('currentUserStatus');
  }, this));
};

currentUser.logout = function () {
  this.oauth.logout(() => this.trigger('currentUserStatus'));
};

currentUser.forgot = function (email, callback) {
  this.oauth.forgot(email, callback);
};

currentUser.signUp = function (email, password, username, callback) {
  this.oauth.signUp(email, password, username, _.bind(function (err) {
    if (err) {
      return callback(err);
    }

    this.trigger('currentUserStatus');
  }, this));
};

module.exports = currentUser;

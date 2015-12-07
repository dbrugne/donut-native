var _ = require('underscore');
var debug = require('../libs/debug')('oauth');
var client = require('../libs/client'); // @mobile
var currentUser = require('./current-user');

// mount oauth methods
currentUser.oauth = require('../libs/oauth');

currentUser.defaults = function () {
  return {unviewed: 0};
};

currentUser.authenticationHasChanged = function () {
  debug.log(
    'authenticationChanged', {
      token: currentUser.oauth.token,
      email: currentUser.oauth.email,
      code: currentUser.oauth.code,
      facebookToken: currentUser.oauth.facebookToken,
      facebookId: currentUser.oauth.facebookId,
      facebookData: currentUser.oauth.facebookData
    }
  );
  this.trigger('authenticationChanged');
};

currentUser.loadInitialState = function () {
  this.oauth.loadStorage(() => {
    this.authenticate();
  });
};

currentUser.renewToken = function () { // @todo : implement token expiration renewal (need callback)
  // cleanup stored token
  currentUser.token = null;
  storage.removeKey('token', (err) => {
    if (err) {
      debug.warn(err);
    }

    this.authenticate();
  });
};

currentUser.authenticate = function () {
  this.oauth.authenticate((err) => {
    if (err) {
      debug.warn(err);
    }

    // trigger LoggedIn/Out switch
    this.authenticationHasChanged();
  });
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

currentUser.getFacebookData = function () {
  return this.oauth.facebookData;
};

currentUser.facebookLoginFound = function (token, userId) {
  // just save Facebook token, do not run authentication logic
  // (to allow user to logout from app and stay on this screen)
  this.oauth.facebookToken = token;
  this.oauth.facebookId = userId;
  this.oauth._fetchFacebookProfile(() => this.authenticationHasChanged());
};

currentUser.hasFacebookToken = function () {
  return !!(this.oauth.facebookToken);
};

currentUser.isAdmin = function () {
  return (this.get('admin') === true);
};

currentUser.facebookLogin = function (token, userId, callback) {
  this.oauth._facebookLogin(token, userId, _.bind(function (err) {
    if (err) {
      return callback(err); // @todo : so we block user in this state?
    }

    this.authenticationHasChanged();
  }, this));
};

currentUser.emailLogin = function (email, password, callback) {
  this.oauth._emailLogin(email, password, _.bind(function (err) {
    if (err) {
      return callback(err); // @todo : so we block user in this state?
    }

    this.authenticationHasChanged();
  }, this));
};

currentUser.emailSignUp = function (email, password, username, callback) {
  this.oauth._emailSignUp(email, password, username, _.bind(function (err) {
    if (err) {
      return callback(err);
    }

    this.authenticationHasChanged();
  }, this));
};

currentUser.logout = function () {
  this.oauth._logout(() => this.authenticationHasChanged());
};

currentUser.forgot = function (email, callback) {
  this.oauth._forgot(email, callback);
};

module.exports = currentUser;

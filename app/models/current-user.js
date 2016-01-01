var _ = require('underscore');
var debug = require('../libs/debug')('oauth');

var user = module.exports = require('../libs/app').user;

// decorate with oauth methods
user.oauth = require('../libs/oauth');

user.defaults = function () {
  return {unviewed: 0};
};

user.authenticationHasChanged = function () {
  debug.log(
    'authenticationChanged', {
      id: this.oauth.id,
      token: this.oauth.token,
      email: this.oauth.email,
      code: this.oauth.code,
      facebookToken: this.oauth.facebookToken,
      facebookId: this.oauth.facebookId,
      facebookData: this.oauth.facebookData,
      facebookAvoidAutoLogin: this.oauth.facebookAvoidAutoLogin
    }
  );
  this.trigger('authenticationChanged');
};

user.loadInitialState = function () {
  this.oauth.loadStorage(() => {
    this.authenticate();
  });
};

user.renewToken = function (callback) {
  this.oauth.authenticate((err) => {
    if (err) {
      debug.warn(err);
      return this.authenticationHasChanged();
    }
    if (!this.oauth.token) {
      debug.warn('unable to renew token');

      // trigger loggedOut screen
      return this.authenticationHasChanged();
    }

    return callback(null, this.oauth.token);
  });
};

user.useFacebookToken = function () {
  this.oauth.facebookAvoidAutoLogin = false;
  this.authenticate();
};

user.authenticate = function () {
  this.oauth.authenticate((err) => {
    if (err) {
      debug.warn(err);
    }

    // trigger LoggedIn/Out switch
    this.authenticationHasChanged();
  });
};

user.isLoggedIn = function () {
  return (this.oauth.loaded && this.oauth.token);
};

user.getId = function () {
  return this.oauth.id;
};

user.getEmail = function () {
  return this.oauth.email;
};

user.getToken = function () {
  return this.oauth.token;
};

user.getFacebookData = function () {
  return this.oauth.facebookData;
};

user.facebookLoginFound = function (token, userId) {
  // just save Facebook token, do not run authentication logic
  // (to allow user to logout from app and stay on this screen)
  this.oauth.facebookToken = token;
  this.oauth.facebookId = userId;
  this.oauth._fetchFacebookProfile(() => this.authenticationHasChanged());
};

user.hasFacebookToken = function () {
  return !!(this.oauth.facebookToken);
};

user.isAdmin = function () {
  return (this.get('admin') === true);
};

user.facebookLogin = function (token, userId, callback) {
  this.oauth._facebookLogin(token, userId, _.bind(function (err) {
    if (err) {
      return callback(err); // @todo : so we block user in this state?
    }

    this.authenticationHasChanged();
  }, this));
};

user.emailLogin = function (email, password, callback) {
  this.oauth._emailLogin(email, password, _.bind(function (err) {
    if (err) {
      return callback(err); // @todo : so we block user in this state?
    }

    this.authenticationHasChanged();
  }, this));
};

user.emailSignUp = function (email, password, username, callback) {
  this.oauth._emailSignUp(email, password, username, _.bind(function (err) {
    if (err) {
      return callback(err);
    }

    this.authenticationHasChanged();
  }, this));
};

user.logout = function () {
  this.oauth._logout(() => this.authenticationHasChanged());
};

user.facebookLogout = function () {
  this.oauth._facebookLogout(() => this.authenticationHasChanged());
};

user.forgot = function (email, callback) {
  this.oauth._forgot(email, callback);
};

user.registerDevice = function (parseObjectId, callback) {
  this.oauth._registerDevice(parseObjectId, callback);
};

'use strict';

var _ = require('underscore');
var async = require('async');
var Backbone = require('backbone');
var storage = require('./storage');
var debug = require('./debug')('oauth');
var config = require('./config')();

var oauth = _.extend({
  id: null,
  email: null,
  token: null,
  code: null,

  facebookToken: null,
  facebookId: null,
  facebookData: null,
  facebookAvoidAutoLogin: false, // handle lack of FacebookLogin.onLoginFound() on Android

  loaded: false,

  _oauthRequest: function (endpoint, body, callback) {
    var url = config.oauth + endpoint;
    var request = _.extend({
      body: JSON.stringify(body)
    }, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    debug.log('<= ajax', url, request);
    fetch(url, request)
      .then((response) => response.json())
      .then((data) => {
        debug.log('=> ajax', data)
        callback(null, data);
      })
      .catch((err) => {
        debug.warn('=> error', err);
        // @todo : handle this error in each caller to reset data
        return callback(err);
      });
  },

  loadStorage: function (callback) {
    if (this.loaded === true) {
      return callback(null);
    }

    storage.getKeys(['id', 'email', 'token', 'code', 'facebookToken', 'facebookId'], _.bind(function (err, values) {
      if (err) {
        return callback(err);
      }

      debug.log('found in storage', values);

      this.id = values.id;
      this.email = values.email;
      this.token = values.token;
      this.code = values.code;

      this.facebookToken = values.facebookToken;
      this.facebookId = values.facebookId;
      this.facebookAvoidAutoLogin = true;

      this.loaded = true;

      return callback(null);
    }, this));
  },

  /**
   * Process stored data (token, facebookToken, email, code) and try to
   * authenticate user automatically.
   * @param callback
   */
  authenticate: function (callback) {
    var hasValidToken = false;

    async.waterfall([
      // try token (if exists)
      (cb) => {
        if (!this.token) {
          return cb(null);
        }

        this._oauthRequest('check-token', { token: this.token }, (err, response) => {
          if (err) {
            return cb(err);
          }
          if (response.err) {
            return cb(response.err);
          }

          if (response.validity === true) {
            hasValidToken = true;
            return cb(null);
          }

          // unset invalid token
          this.token = null;
          storage.removeKey('token', function (err) {
            return cb(err);
          });
        });
      },
      // try with Facebook token (if exists)
      (cb) => {
        if (hasValidToken || this.facebookAvoidAutoLogin || !this.facebookToken) {
          return cb(null);
        }

        this._oauthRequest('get-token-from-facebook', { access_token: this.facebookToken }, (err, response) => {
          if (err) {
            return cb(err);
          }
          if (response.err) {
            // passport-facebook-token-invalid
            // suspended
            // unknown
            // deleted
            debug.warn(response.err);
            this.id = null;
            this.facebookToken = null;
            this.facebookId = null;
            this.facebookData = null;
            return storage.removeKeys(['id', 'facebookToken', 'facebookId', 'facebookData'], (err) => {
              if (err) {
                logger.warn(err);
              }

              cb(null);
            });
          }

          hasValidToken = true;
          this.id = response.id;
          this.token = response.token;
          this.code = '';
          storage.setKeys({
            id: this.id,
            token: this.token,
            code: this.code
          }, () => cb(null));
        });
      },
      // try with code (if exists)
      (cb) => {
        if (hasValidToken || !this.email || !this.code) {
          return cb(null);
        }

        this._oauthRequest('get-token-from-credentials', { email: this.email, code: this.code }, (err, response) => {
          if (err) {
            return cb(err);
          }
          if (response.err) {
            // unset current code
            storage.removeKey('code', function (err) {
              if (err) {
                return cb(err);
              }
              return cb(response.err);
            });
          }

          this.id = response.id;
          this.token = response.token;
          this.code = response.code;
          storage.setKeys({
            id: this.id,
            token: this.token,
            code: this.code
          }, cb);
        });
      }

    ], callback);
  },

  /**
   * Retrieve ws token with Facebook token
   * @param facebookToken
   * @param userId
   * @param callback
   */
  _facebookLogin: function (facebookToken, userId, callback) {
    if (!facebookToken) {
      return callback(null, false);
    }

    // @important
    this.token = null;
    this.email = null;
    this.code = null;
    storage.removeKeys(['id', 'token', 'code', 'email'], () => {
      this.facebookToken = facebookToken;
      this.facebookId = userId; // only to retrieve user name via GraphAPI
      this.facebookAvoidAutoLogin = false;
      storage.setKeys({
        facebookToken: this.facebookToken,
        facebookId: this.facebookId
      }, () => this.authenticate(callback));
    });
  },

  /**
   * Retrieve token from email and password
   * @param email
   * @param password
   * @param callback
   */
  _emailLogin: function (email, password, callback) {
    this.email = email;
    this.facebookToken = null; // @important
    this.facebookId = null; // @important
    storage.removeKeys(['facebookToken', 'facebookId'], () => {
      storage.setKey('email', email, _.bind(function (err) {
        if (err) {
          return callback(err);
        }

        this._oauthRequest('get-token-from-credentials', { email: email, password: password }, _.bind(function (err, response) {
          if (err) {
            return callback(err);
          }
          if (response.err) {
            return callback(response.err);
          }

          this.id = response.id;
          this.token = response.token;
          this.code = response.code;
          storage.setKeys({
            id: this.id,
            token: this.token,
            code: this.code
          }, callback);
        }, this));
      }, this));
    });
  },

  /**
   * Try to signup user with email and password
   * @param email
   * @param password
   * @param username
   * @param callback
   * @private
   */
  _emailSignUp: function (email, password, username, callback) {
    this.email = email;
    this.facebookToken = null; // @important
    this.facebookId = null; // @important
    storage.removeKeys(['facebookToken', 'facebookId'], () => {
      storage.setKey('email', email, _.bind(function (err) {
        if (err) {
          return callback(err);
        }

        this._oauthRequest('signup', { email: email, password: password, username: username }, _.bind(function (err, response) {
          if (err) {
            return callback(err);
          }
          if (response.err) {
            return callback(response.err);
          }

          this.id = response.id;
          this.token = response.token;
          this.code = response.code;
          storage.setKeys({
            id: this.id,
            token: this.token,
            code: this.code
          }, callback);
        }, this));
      }, this));
    })
  },

  /**
   * Logout user by removing token and code data from locale storage
   * @param callback
   * @private
   */
  _logout: function (callback) {
    this.id = null;
    this.token = null;
    this.code = null;
    this.facebookAvoidAutoLogin = true;
    storage.removeKeys(['id', 'token', 'code'], callback);
  },

  /**
   * Handle Facebook Logout event by removing Facebook keys
   * @param callback
   * @private
   */
  _facebookLogout: function (callback) {
    this.facebookToken = null;
    this.facebookId = null;
    storage.removeKeys(['facebookToken', 'facebookId'], () => {
      this._logout(callback);
    });
  },

  /**
   * Send forgot password email to user
   * @param email
   * @param callback
   * @private
   */
  _forgot: function (email, callback) {
    this._oauthRequest('forgot', { email: email }, (err, response) => {
      if (err) {
        return callback(err);
      }
      if (response.err) {
        return callback(response.err);
      }

      return callback(null);
    });
  },

  _fetchFacebookProfile: function (callback) {
    if (!this.facebookToken || !this.facebookId) {
      return callback();
    }
    var api = `https://graph.facebook.com/v2.3/${this.facebookId}?fields=name,picture&access_token=${this.facebookToken}`;
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        this.facebookData = data;
        callback();
      });
  }

}, Backbone.Events);

module.exports = oauth;

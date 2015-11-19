'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var storage = require('../libs/storage');

var oauth = _.extend({

  email: null,
  token: null,
  code: null,

  requireUsername: false,

  loaded: false,

  oauthBaseUrl: 'https://test.donut.me/oauth/',

  oauthHeaders: {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },

  oauthRequest: function (endpoint, body, callback) {
    var url = this.oauthBaseUrl + endpoint;
    var request = _.extend({
      body: JSON.stringify(body)
    }, this.oauthHeaders);

    console.log('<= ajax', url, request);
    fetch(url, request)
      .then((response) => response.json())
      .then((data) => {
        console.log('=> ajax', data)
        callback(null, data);
      })
      .catch((err) => { throw new Error(err) });
  },

  loadStorage: function (callback) {
    if (this.loaded === true) {
      return callback(null);
    }

    storage.getKeys(['email', 'token', 'code'], _.bind(function (err, values) {
      if (err) {
        return callback(err);
      }

      console.log('found in storage', values);

      this.email = values.email;
      this.token = values.token;
      this.code = values.code;
      this.loaded = true;

      return callback(null);
    }, this));
  },

  /**
   * Determine current token/code validity
   * @param data
   * @param callback
   */
  checkStatus: function (callback) {
    if (!this.token && !this.code) {
      return callback(null);
    }

    this.checkToken(_.bind(function (err, isTokenValid) {
      if (err) {
        return callback(err);
      }

      if (isTokenValid === true) {
        return callback(null);
      }

      this.checkCode(callback);
    }, this));
  },

  /**
   * Check token validity
   * @param token
   * @param callback
   */
  checkToken: function (callback) {
    if (!this.token) {
      return callback(null, false);
    }

    this.oauthRequest('check-token', { token: this.token }, _.bind(function (err, response) {
      if (err) {
        return callback(err, false);
      }

      if (response.validity === true) {
        return callback(null, true);
      }

      // unset invalid token
      this.token = null;
      storage.removeKey('token', function (err) {
        return callback(err, false);
      });
    }, this));
  },

  /**
   * Try to retrieve a token from email and code
   * @param callback
   */
  checkCode: function (callback) {
    if (!this.email && !this.code) {
      return callback(null);
    }

    this.oauthRequest('get-token-from-credentials', { email: this.email, code: this.code }, _.bind(function (err, response) {
      if (err) {
        return callback(err);
      }
      if (response.err && response.err !== 'no-username') {
        // unset current code
        storage.removeKey('code', function (err) {
          if (err) {
            return callback(err);
          }

          return callback(response.err);
        });
      }

      if (response.err === 'no-username') {
        this.requireUsername = true;
      }

      this.token = response.token;
      this.code = response.code;
      storage.setKeys({
        token: this.token,
        code: this.code
      }, function (err) {
        if (err) {
          return callback(err);
        }

        return callback(null);
      });
    }, this));
  },

  /**
   * Retrieve token with email and password
   * @param email
   * @param password
   * @param callback
   */
  login: function (email, password, callback) {
    this.email = email;
    console.log(email, this.email);
    storage.setKey('email', email, _.bind(function (err) {
      if (err) {
        return callback(err);
      }
      console.log(email, this.email);

      this.oauthRequest('get-token-from-credentials', { email: email, password: password }, _.bind(function (err, response) {
        if (err) {
          return callback(err);
        }
        if (response.err && response.err !== 'no-username') {
          return callback(response.err);
        }

        if (response.err === 'no-username') {
          this.requireUsername = true;
        }

        this.token = response.token;
        this.code = response.code;
        storage.setKeys({
          token: this.token,
          code: this.code
        }, callback);
      }, this));
    }, this));
  },

  logout: function (callback) {
    this.token = null;
    this.code = null;
    storage.removeKeys(['token', 'code'], callback);
  },

  signUp: function (email, password, username, callback) {
    this.email = email;
    console.log(email, this.email);
    storage.setKey('email', email, _.bind(function (err) {
      if (err) {
        return callback(err);
      }
      console.log(email, this.email);

      this.oauthRequest('signup', { email: email, password: password, username: username }, _.bind(function (err, response) {
        if (err) {
          return callback(err);
        }
        if (response.err) {
          return callback(response.err);
        }

        this.token = response.token;
        storage.setKeys({
          token: this.token
        }, callback);
      }, this));
    }, this));
  },

  forgot: function (email, callback) {
    this.oauthRequest('forgot', { email: email }, _.bind(function (err, response) {
      if (err) {
        return callback(err);
      }
      if (response.err) {
        return callback(response.err);
      }

      return callback(null);
    }, this));
  }

}, Backbone.Events);

module.exports = oauth;

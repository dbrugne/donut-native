var _ = require('underscore');
var Backbone = require('backbone');
var app = require('../libs/app');
var client = require('../libs/client');
var oauth = require('../libs/oauth'); // @mobile

// @todo : implement a MobileCurrentUser that extend current-user and add oauth logic and methods

var CurrentUserModel = Backbone.Model.extend({
  oauth: oauth,  // @mobile

  defaults: function () {
    return {
      token: null, // @mobile
      code: null // @mobile
    };
  },

  initialize: function () {
    this.listenTo(client, 'welcome', this.onWelcome);
    this.listenTo(client, 'user:updated', this.onUpdated);
    this.listenTo(client, 'preferences:update', this.setPreference);

    // listen for client statuses (should be done only by client and view??)
    var statuses = {
      connecting: 'connecting',
      connect: 'online',
      disconnect: 'offline',
      reconnect: 'online',
      reconnect_attempt: 'connecting',
      reconnecting: 'connecting',
      reconnect_error: 'connecting',
      reconnect_failed: 'error',
      error: 'error'
    };
    _.each(statuses, _.bind(function (element, key) {
      this.listenTo(client, key, _.bind(function () {
        this.set('status', element);
      }, this));
    }, this));
  },

  onWelcome: function (data) {
    this.set(data.user);
    this.setPreferences(data.preferences);
    app.trigger('muteview');
  },

  onUpdated: function (data) {
    if (data.username !== this.get('username')) {
      return;
    }
    _.each(data.data, _.bind(function (value, key) {
      this.set(key, value);
    }, this));
  },
  setPreference: function (data, options) {
    options = options || {};

    var keys = Object.keys(data);
    if (!keys || !keys.length) {
      return;
    }

    var key = keys[ 0 ];
    if (!key) {
      return;
    }

    var preferences = this.get('preferences') || {};
    preferences[ key ] = data[ key ];
    this.set('preferences', preferences, options);
  },
  setPreferences: function (preferences, options) {
    options = options || {};

    if (!preferences) {
      return;
    }

    var newPreferences = {}; // reset all previous keys
    _.each(preferences, function (value, key, list) {
      newPreferences[ key ] = value;
    });

    this.set('preferences', newPreferences, options);
  },

  loadInitialState: function () {
    this.oauth.loadStorage(_.bind(function () {
      this.oauth.checkStatus(_.bind(function (err) {
        if (err) {
          console.warn(err);
        }

        // trigger LoggedOut navigation tree
        this.trigger('currentUserStatus');
      }, this));
    }, this));
  },

  isLoggedIn: function () {
    return (this.oauth.loaded && this.oauth.token);
  },

  getEmail: function () {
    return this.oauth.email;
  },

  getToken: function () {
    return this.oauth.token;
  },

  isAdmin: function () {
    return (this.get('admin') === true);
  },

  login: function (email, password, callback) {
    this.oauth.login(email, password, _.bind(function (err) {
      if (err) {
        return callback(err);
      }

      this.trigger('currentUserStatus');
    }, this));
  },
  logout: function () {
    this.oauth.logout(() => this.trigger('currentUserStatus'));
  },
  forgot: function (email, callback) {
    callback(null);
  },
  signUp: function (email, password, username, callback) {
    this.oauth.signUp(email, password, username, _.bind(function (err) {
      if (err) {
        return callback(err);
      }

      this.trigger('currentUserStatus');
    }, this));
  }

});

module.exports = new CurrentUserModel();

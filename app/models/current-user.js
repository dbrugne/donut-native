var _ = require('underscore');
var Backbone = require('backbone');
var client = require('../libs/client');
var oauth = require('../libs/oauth');

var CurrentUserModel = Backbone.Model.extend({
  oauth: oauth,

  defaults: function () {
    return {
      user_id: '',
      username: '',
      avatar: '',
      status: '',
      admin: false,
      token: null,
      code: null
    };
  },

  initialize: function () {
    this.listenTo(client, 'user:updated', this.onUpdated);

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

  onUpdated: function (data) {
    if (data.username !== this.get('username')) {
      return;
    }
    _.each(data.data, _.bind(function (value, key) {
      this.set(key, value);
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
  }

});

module.exports = new CurrentUserModel();

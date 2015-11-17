/**
 * https://developers.facebook.com/quickstarts/328600083963864/?platform=ios
 * https://github.com/magus/react-native-facebook-login
 * https://github.com/facebook/react-native-fbsdk
 * http://brentvatne.ca/facebook-login-with-react-native/
 */

var _ = require('underscore');
var config = require('./config');

var exports = module.exports = {};

/**
 * Try to login/signup user with Facebook
 * @param success
 * @param failed
 */
exports.loginWithFacebook = function (success, failed) {
  console.log('[SECURITY] Retrieve current Facebook login status');
  var that = this;
  steroids.addons.facebook.getLoginStatus().then(function (result) {
    console.log('[SECURITY] Current Facebook login status is: ' + result.status);

    if (result.status !== 'connected') {
      return that.requestFacebookAuthorization(success, failed);
    }

    console.log('[SECURITY] Retrieve current Facebook access token');
    steroids.addons.facebook.getAccessToken().then(function (facebookToken) {
      console.log('[SECURITY] Current Facebook access token: ' + facebookToken);
      if (!facebookToken) {
        that.requestFacebookAuthorization(success, failed); // not sure this
                                                            // case is
                                                            // needed, seems
                                                            // to go in error
                                                            // callback
      } else {
        that.checkFacebookToken(facebookToken, success, failed);
      }
    }).error(function (e) {
      console.error('steroids.addons.facebook.getAccessToken() error: ' + e.message);
      that.requestFacebookAuthorization(success, failed);
    });
  }).error(function (e) {
    console.error('steroids.addons.facebook.getLoginStatus() error: ' + e.message);
    return failed('plugin');
  });
};

/**
 * Request Facebook authorization through Phonegap Facebook plugin
 * @param success
 * @param failed
 */
exports.requestFacebookAuthorization = function (success, failed) {
  /**
   * @doc: https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
   *
   * response = {
       *   status: "connected",
       *   authResponse: {
       *     accessToken    : String,
       *     expiresIn      : "5183854",
       *     secret:        : "..."
       *     session_key:   : true
       *     sig            : "...",
       *     userID         : "10205335003027707"
       *   }
       * }
   */
  console.log('[SECURITY] Requesting Facebook authorization');
  var that = this;
  steroids.addons.facebook.login([ 'email' ]).then(function (response) {
    if (!response || !response.authResponse || !response.authResponse.accessToken || response.status !== 'connected') {
      console.warn('[SECURITY] Facebook authorization refused, user has probably canceled or refused');
      return failed('refused');
    }

    var facebookToken = response.authResponse.accessToken;
    console.log('[SECURITY] Facebook successfully done: uid:' + response.authResponse.userID + ' status:' + response.status + ' token:' + facebookToken);

    that.checkFacebookToken(facebookToken, success, failed);
  }).error(function (e) {
    console.error('error with Facebook plugin: ' + e.message);
    return failed('plugin');
  });
};

/**
 * Retrieve DONUT token from Facebook token
 * @param facebookToken
 * @param success
 * @param failed
 */
exports.checkFacebookToken = function (facebookToken, success, failed) {
  console.log('[SECURITY] Calling ' + config.ws.facebook + ' with ' + facebookToken);
  $.ajax({
    url: config.ws.facebook,
    type: 'POST',
    data: {
      access_token: facebookToken
    },
    dataType: 'json',
    success: _.bind(function (json) {
      if (json.err) {
        console.error('[SECURITY] Error while checking Facebook token: ' + json.err);

        if (json.err === 'no-username') {
          this.setToken(json.token);
        } // we get a token in this particular error case, allows us to save
          // username later

        return failed(json.err);
      }

      this.setToken(json.token);
      this.setCode();
      return success();
    }, this),
    error: ajaxErrorHandler(failed)
  });
};

/**
 * Save username on account related to currently stored session token
 * @param username
 * @param success
 * @param failed
 */
exports.saveUsername = function (username, success, failed) {
  var token = this.getToken();
  if (!token) {
    return failed('no-token');
  }
  if (!username) {
    return failed('internal');
  }

  console.log('[SECURITY] Calling ' + config.ws.username + ' with ' + username);
  $.ajax({
    url: config.ws.username,
    type: 'POST',
    data: {
      token: token,
      username: username
    },
    dataType: 'json',
    success: _.bind(function (json) {
      if (json.err) {
        console.error('[SECURITY] Error while saving username: ' + json.err);
        return failed(json.err);
      }

      console.log('[SECURITY] Successfully saved username');
      return success();
    }, this),
    error: ajaxErrorHandler(failed)
  });
};

/**
 * Signup a username with email, password and username
 *
 * @param email
 * @param password
 * @param username
 * @param success
 * @param failed
 */
exports.signup = function (email, password, username, success, failed) {
  console.log('[SECURITY] Calling ' + config.ws.signup + ' with ' + email + '/' + username);
  $.ajax({
    url: config.ws.signup,
    type: 'POST',
    data: {
      email: email,
      password: password,
      username: username
    },
    dataType: 'json',
    success: _.bind(function (json) {
      if (json.err) {
        console.error('[SECURITY] Error in signup: ' + json.err);
        return failed(json.err);
      }

      // persist received token
      this.setToken(json.token);

      console.log('[SECURITY] Successfully signuped user');
      return success();
    }, this),
    error: ajaxErrorHandler(failed)
  });
};

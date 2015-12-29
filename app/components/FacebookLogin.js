'use strict';

var React = require('react-native');
var FBLogin = require('react-native-facebook-login');
var debug = require('../libs/debug')('oauth');
var s = require('../styles/style');

var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Image
} = React;
var {
  Icon
} = require('react-native-icons');

var currentUser = require('../models/current-user');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'already-logged-as': 'You are already identified with Facebook as __username__',
  'already-logged': 'You are already identified with Facebook',
  'use': 'Use this Facebook account'
});

module.exports = React.createClass({
  render () {
    var useFacebookToken = null;
    if (currentUser.hasFacebookToken()) {
      var data = currentUser.getFacebookData();
      var avatar = (data && data.picture && data.picture.data && data.picture.data.url)
        ? (<Image source={{uri: data.picture.data.url}} style={{width: 50, height: 50, marginBottom:10, alignSelf: 'center'}} />)
        : null;
      var message = (data && data.name)
        ? i18next.t('local:already-logged-as', {username: data.name})
        : i18next.t('local:already-logged');

      useFacebookToken = (
        <View style={styles.container}>
          <View style={styles.container}>
            {avatar}
            <Text style={{marginBottom: 10, textAlign: 'center'}}>{message}</Text>
            <TouchableHighlight onPress={() => currentUser.useFacebookToken()}
                                style={[s.button, styles.buttonFacebook]}
                                underlayColor='#647EB7'
              >
              <View style={[s.buttonLabel, styles.buttonLabelFacebook]}>
                <View style={styles.iconContainer}>
                  <Icon
                    name='fontawesome|facebook'
                    size={28}
                    color='#FFF'
                    style={[styles.icon, styles.iconFacebook]}
                    />
                </View>
                <Text style={[s.buttonText, styles.buttonTextFacebook]}>{i18next.t('local:use')}</Text>
              </View>
            </TouchableHighlight>

          </View>
          <View style={styles.divider}></View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {useFacebookToken}
        <View style={styles.container}>
          <View style={[s.button, s.buttonBlue]}>
            <FBLogin
              permissions={['email']}
              onLogin={this.onLogin}
              onLogout={this.onLogout}
              onLoginFound={this.onLoginFound}
              onLoginNotFound={this.onLoginNotFound}
              onError={this.onError}
              onCancel={this.onCancel}
              onPermissionsMissing={this.onPermissionsMissing}
            />
          </View>
        </View>
      </View>
    );
  },
  onLogin (data) {
    debug.log('onLogin', data);
    // iOS / Android data format is different
    var token = (data.credentials && data.credentials.token)
      ? data.credentials.token
      : data.token;
    var id = (data.credentials && data.credentials.userId)
      ? data.credentials.userId
      : data.userId;
    currentUser.facebookLogin(token, id, function (err) {
      if (err) {
        debug.warn('onLogin.facebookLogin error', err);
      }
    });
  },
  // iOS only
  onLoginFound (data) {
    debug.log('onLoginFound', data);
    currentUser.facebookLoginFound(data.credentials.token, data.credentials.userId);
  },
  // iOS only
  onLoginNotFound () {
    debug.log('onLoginNotFound');
  },
  onLogout (data) {
    debug.log('onLogout', data);
    currentUser.facebookLogout();
  },
  onCancel () {
    debug.log('onCancel');
  },
  onPermissionsMissing (data) {
    debug.log('onPermissionsMissing', data);
  },
  onError (data) {
    debug.log('onError', data);
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  divider: {
    marginVertical:5,
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row'
  },
  buttonFacebook: {
    backgroundColor: "#4a649d",
    borderColor: "#4a649d",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    marginBottom: 0
  },
  buttonLabelFacebook: {
    justifyContent: 'flex-start'
  },
  buttonTextFacebook: {
    fontWeight: 'normal',
    fontSize: 18,
    color: "#FFF",
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1
  },
  iconFacebook: {
    paddingRight: 5,
    marginRight: 5,
    alignSelf: 'flex-end'
  },
  icon: {
    width: 28,
    height: 28
  }
});

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

var currentUser = require('../models/current-user');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'facebookLogin', {
  'already-logged-as': 'You are already identified with Facebook as __username__',
  'already-logged': 'You are already identified with Facebook',
  'use': 'USE THIS FACEBOOK ACCOUNT'
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
        ? i18next.t('facebookLogin:already-logged-as', {username: data.name})
        : i18next.t('facebookLogin:already-logged');

      useFacebookToken = (
        <View style={styles.container}>
          <View style={styles.container}>
            {avatar}
            <Text style={{marginBottom: 20, marginTop: 10, textAlign: 'center', fontFamily: 'Open Sans', fontSize: 12, color: '#FFFFFF' }}>{message}</Text>
            <TouchableHighlight onPress={() => currentUser.useFacebookToken()}
                                style={[s.button, s.buttonBlue, styles.shadow]}
                                underlayColor='#647EB7'
              >
              <View style={[s.buttonLabel, styles.buttonLabelFacebook]}>
                <Text style={[s.buttonText, styles.buttonTextFacebook]}>{i18next.t('facebookLogin:use')}</Text>
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
          <View style={[s.button, s.buttonBlue, styles.shadow]}>
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
    this.props.showLoadingModal();
    currentUser.facebookLogin(token, id, function (err) {
      this.props.hideLoadingModal();
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
  shadow: {
    shadowColor: 'rgb(30,30,30)',
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.75
  }
});

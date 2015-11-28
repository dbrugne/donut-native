'use strict';

var React = require('react-native');
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} = React;

var currentUser = require('../models/mobile-current-user');

// @todo test with user that refuse email permission

module.exports = React.createClass({
  getInitialState () {
    return { fakeLogin: false };
  },
  render () {
    var fakeButton = null;
    if (this.state.fakeLogin) {
      // @todo : ylastapis : skin this fake button that is diplayed when the user has authenticated with Facebook on mobile, and then logout
      //                     the onLoginFound function is hit on login page display and the native FBLogin display a logout button, so I added
      //                     this fake button
      fakeButton = (
        <View>
          <View style={styles.container}>
            <View style={styles.enlargedButton}>
              <TouchableHighlight style={styles.fakeButton} onPress={() => currentUser.facebookLogin(currentUser.oauth.facebookToken, (err) => { console.log('FBLogin error', err) })}>
                <Text style={styles.fakeButtonText}>
                  Use your existing Facebook credentials
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <Text>OR</Text>
        </View>
      );
    }

    return (
      <View>
        {fakeButton}
        <View style={styles.container}>
          <View style={styles.enlargedButton}>
            <FBLogin
              permissions={['email']}
              loginBehavior={FBLoginManager.LoginBehaviors.Native}
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
    console.log('onLogin', data);
    currentUser.facebookLogin(data.credentials.token, function (err) {
      console.log('onLogin.onLogin error', err);
    });
    currentUser.oauth.facebookToken = data.credentials.token;
  },
  onLoginFound (data) {
    console.log('onLoginFound', data);
    currentUser.oauth.facebookToken = data.credentials.token;
    this.setState({
      fakeLogin: true
    });
  },
  onLoginNotFound () {
    console.log('onLoginNotFound');
  },
  onLogout (data) {
    console.log('onLogout', data);
    currentUser.logout();
    this.setState({
      fakeLogin: false
    });
  },
  onCancel () {
    console.log('onCancel');
  },
  onPermissionsMissing (data) {
    console.log('onPermissionsMissing', data);
  },
  onError (data) {
    console.log('onError', data);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 35
  },
  enlargedButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#425eb1',
    borderRadius: 4
  },
  fakeButtonText: {
    color: '#FFF'
  }
});

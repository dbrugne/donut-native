'use strict';

var React = require('react-native');
var FBLogin = require('react-native-facebook-login');
var s = require('../styles/style');

var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} = React;
var {
  Icon
  } = require('react-native-icons');

var currentUser = require('../models/mobile-current-user');

// @todo test with user that refuse email permission

module.exports = React.createClass({
  getInitialState () {
    return { fakeLogin: false };
  },
  render () {
    var fakeButton = null;
    if (this.state.fakeLogin) {
      //                     the onLoginFound function is hit on login page display and the native FBLogin display a logout button, so I added
      //                     this fake button
      fakeButton = (
        <View style={styles.container}>
          <View style={styles.container}>

            <TouchableHighlight onPress={() => currentUser.facebookLogin(currentUser.oauth.facebookToken, (err) => { console.log('FBLogin error', err) })}
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
                <Text style={[s.buttonText, styles.buttonTextFacebook]}>Already identified : log-in</Text>
              </View>
            </TouchableHighlight>

          </View>
          <View style={styles.divider}></View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {fakeButton}
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
    // iOS / Android date format difference
    var token = (data.credentials && data.credentials.token)
      ? data.credentials.token
      : data.token;
    console.log('onLogin', data);
    currentUser.facebookLogin(token, function (err) {
      console.log('onLogin.onLogin error', err);
    });
    currentUser.oauth.facebookToken = token; // @todo : in oauth.facebookLogin
  },
  // iOS only
  onLoginFound (data) {
    console.log('onLoginFound', data);
    currentUser.oauth.facebookToken = data.credentials.token;
    this.setState({
      fakeLogin: true
    });
  },
  // iOS only
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
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  divider: {
    marginVertical:10,
    marginHorizontal:10,
    height:1,
    backgroundColor: '#C3C3C3',
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

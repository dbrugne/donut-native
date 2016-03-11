var React = require('react-native');
var currentUser = require('../models/current-user');
var LoadingView = require('../components/Loading');
var app = require('../libs/app');
var alert = require('../libs/alert');
var Button = require('../components/Button');
var ListItem = require('../components/ListItem');
var KeyboardAware = require('../components/KeyboardAware');

var s = require('../styles/style');

var {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountPassword', {
  'old-password': 'Old password',
  'change-password': 'Change password',
  'new-password': 'New password',
  'confirm': 'Confirm',
  'change': 'CHANGE',
  'wrong-format': 'Password should be between 6 and 50 characters length',
  'wrong-password': 'Old password is wrong'
});

var ChangePasswordView = React.createClass({
  getInitialState: function () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      hasPassword: false,
      loaded: false,
      loadingRequest: false
    };
  },
  componentDidMount () {
    app.client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
      this.setState({
        loaded: true,
        hasPassword: !!(response.account && response.account.has_password)
      });
    });
  },
  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    var inputOldPassword;
    if (this.state.hasPassword) {
      inputOldPassword = (
        <View style={{ flex: 1 }}>
          <ListItem
            last
            type='input'
            ref='1'
            autoCapitalize='none'
            autoFocus
            placeholder={i18next.t('myAccountPassword:old-password')}
            secureTextEntry
            returnKeyType='next'
            style={[styles.input, s.marginTop10]}
            onChangeText={(text) => this.setState({oldPassword: text})}
            />
        </View>
      );
    }

    return (
      <KeyboardAware
        shouldShow={() => { return true }}
        shouldHide={() => { return true }}
        >
        <ScrollView
          ref='scrollView'
          contentContainerStyle={{ flex: 1 }}
          keyboardDismissMode='on-drag'
          style={{ flex: 1, padding: 20 }}>
          <View>
            <Text style={[s.h1, s.textCenter, s.marginTop5]}>{i18next.t('myAccountPassword:change-password')}</Text>

            <View style={{ marginTop: 20 }}/>

            {inputOldPassword}

            <View style={{ flex: 1 }}>
              <ListItem
                last
                type='input'
                ref='2'
                autoCapitalize='none'
                placeholder={i18next.t('myAccountPassword:new-password')}
                secureTextEntry
                returnKeyType='next'
                onChangeText={(text) => this.setState({newPassword: text})}
                />
            </View>

            <View style={{ flex: 1 }}>
              <ListItem
                last
                type='input'
                ref='3'
                autoCapitalize='none'
                placeholder={i18next.t('myAccountPassword:confirm')}
                secureTextEntry
                returnKeyType='done'
                onChangeText={(text) => this.setState({confirmPassword: text})}
                />
            </View>
          </View>

          <Button onPress={(this.onSubmitPressed)}
                  type='gray'
                  style={[s.marginTop10]}
                  loading={this.state.loadingRequest}
                  label={i18next.t('myAccountPassword:change')}
            />

        </ScrollView>
      </KeyboardAware>
    );
  },
  onSubmitPressed () {
    if (!this.state.newPassword || (this.state.hasPassword && !this.state.oldPassword)) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    if (this.state.newPassword !== this.state.confirmPassword) {
      return alert.show(i18next.t('messages.not-same-password'));
    }

    this.setState({loadingRequest: true});
    app.client.accountPassword(this.state.newPassword, this.state.oldPassword, (response) => {
      this.setState({loadingRequest: false});
      if (response.err) {
        if (response.err === 'wrong-format') {
          alert.show(i18next.t('myAccountPassword:wrong-format'));
        } else if (response.err === 'wrong-password') {
          alert.show(i18next.t('myAccountPassword:wrong-password'));
        } else {
          alert.show(i18next.t('messages.' + response.err));
        }
      } else {
        alert.show(i18next.t('messages.success'));
      }
    });
  },
});

module.exports = ChangePasswordView;

var styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  input: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    backgroundColor: '#FFF',
    color: '#333',
    height: 40,
    paddingBottom: 3,
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1
  }
});

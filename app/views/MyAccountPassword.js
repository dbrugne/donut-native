var React = require('react-native');
var Platform = require('Platform');
var currentUser = require('../models/current-user');
var LoadingView = require('../components/Loading');
var app = require('../libs/app');
var alert = require('../libs/alert');
var Button = require('../components/Button');

var s = require('../styles/style');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountPassword', {
  'old-password': 'old password',
  'change-password': 'Change password',
  'new-password': 'new password',
  'confirm': 'confirm',
  'change': 'CHANGE'
});

class ChangePasswordView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      hasPassword: false,
      loaded: false
    };
  }

  componentDidMount () {
    app.client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
      this.setState({
        loaded: true,
        hasPassword: !!(response.account && response.account.has_password)
      });
    });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    var inputOldPassword;
    if (this.state.hasPassword) {
      inputOldPassword = (
        <View ref='old-password'
          style={[s.inputContainer, s.marginTop5]}>
        <TextInput
          ref='1'
          autoCapitalize='none'
          autoFocus={true}
          placeholder={i18next.t('myAccountPassword:old-password')}
          secureTextEntry={true}
          returnKeyType='next'
          style={[styles.input, s.marginTop10]}
          onChangeText={(text) => this.setState({oldPassword: text})}
          onFocus={this.inputFocused.bind(this, 'old-password')}
          onBlur={this.inputBlured.bind(this, 'old-password')}
          onSubmitEditing={() => this._focusNextField('2')}
          />
        </View>
      );
    }

    return (
      <View style={{ flex:1, alignItems: 'stretch'}}>
        <ScrollView
          ref='scrollView'
          contentContainerStyle={{flex:1}}
          keyboardDismissMode='on-drag'
          style={{flex: 1, backgroundColor: '#f0f0f0'}}>
          <View>
            <Text style={[s.h1, s.textCenter, s.marginTop5]}>{i18next.t('myAccountPassword:change-password')}</Text>

            {inputOldPassword}

            <View ref='new-password'
                  style={[s.inputContainer, s.marginTop5]}>
              <TextInput
                ref='2'
                autoCapitalize='none'
                placeholder={i18next.t('myAccountPassword:new-password')}
                secureTextEntry={true}
                returnKeyType='next'
                style={[styles.input, s.marginTop10]}
                onChangeText={(text) => this.setState({newPassword: text})}
                onFocus={this.inputFocused.bind(this, 'new-password')}
                onBlur={this.inputBlured.bind(this, 'new-password')}
                onSubmitEditing={() => this._focusNextField('3')}
                />
            </View>

            <View ref='confirm'
                  style={[s.inputContainer, s.marginTop5]}>
              <TextInput
                ref='3'
                autoCapitalize='none'
                placeholder={i18next.t('myAccountPassword:confirm')}
                secureTextEntry={true}
                returnKeyType='done'
                style={[styles.input, s.marginTop10]}
                onChangeText={(text) => this.setState({confirmPassword: text})}
                onFocus={this.inputFocused.bind(this, 'confirm')}
                onBlur={this.inputBlured.bind(this, 'confirm')}
                />
            </View>

           </View>

          <Button onPress={(this.onSubmitPressed.bind(this))}
                  type='green'
                  style={[s.marginTop10]}
                  label={i18next.t('myAccountPassword:change')} />

        </ScrollView>
      </View>
    )
  }

  onSubmitPressed () {
    if (!this.state.newPassword || (this.state.hasPassword && !this.state.oldPassword)) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    if (this.state.newPassword !== this.state.confirmPassword) {
      return alert.show(i18next.t('messages.not-same-password'));
    }

    app.client.accountPassword(this.state.newPassword, this.state.oldPassword, (response) => {
      if (response.err) {
        alert.show(i18next.t('messages.' + response.err));
      } else {
        alert.show(i18next.t('messages.success'));
      }
    });
  }

  inputFocused (refName) {
    setTimeout(() => {
      this._updateScroll(refName, 60);
    }, 300); // delay between keyboard opening start and scroll update (no callback after keyboard is rendered)
  }

  inputBlured (refName) {
    setTimeout(() => {
      this._updateScroll(refName, -60);
    }, 300); // delay between keyboard opening start and scroll update (no callback after keyboard is rendered)
  }

  _updateScroll(refName, offset) {
    let scrollResponder = this.refs.scrollView.getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(this.refs[refName]),
      offset,
      true
    );
  }

  _focusNextField(nextField) {
    this.refs[nextField].focus()
  }
}

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
    color: "#333",
    height: 40,
    paddingBottom: 3,
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1
  }
});

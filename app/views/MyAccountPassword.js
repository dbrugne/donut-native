var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Platform = require('Platform');
var LoadingView = require('../components/Loading');
var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ToastAndroid
  } = React;

var currentUser = require('../models/mobile-current-user');

class ChangePasswordView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: [],
      messages: [],
      hasPassword: false,
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
      this.setState({
        load: true,
        hasPassword: !!(response.account && response.account.has_password)
      });
    });
  }

  render () {
    if (!this.state.load) {
      return (
        <LoadingView />
      );
    }

    var messages = null;
    if ((this.state.errors && this.state.errors.length > 0) || (this.state.messages && this.state.messages.length > 0)) {
      if (this.state.errors && this.state.errors.length > 0) {
        messages = (
          <View style={s.alertError}>
            {this.state.errors.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
          </View>
        );
      } else {
        messages = (
          <View style={s.alertSuccess}>
            {this.state.errors.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
          </View>
        );
      }
    }

    var inputOldPassword;
    if (this.state.hasPassword) {
      inputOldPassword = (
        <View style={[s.inputContainer, s.marginTop5]}>
          <TextInput
          placeholder="old password"
          secureTextEntry={true}
          onChange={(event) => this.setState({oldPassword: event.nativeEvent.text})}
          style={s.input} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={[s.h1, s.textCenter, s.marginTop5]}>Change password</Text>

        {messages}

        <Text style={s.marginTop20}></Text>

        {inputOldPassword}

        <View style={[s.inputContainer, s.marginTop5]}>
          <TextInput
            placeholder="new password"
            secureTextEntry={true}
            onChange={(event) => this.setState({newPassword: event.nativeEvent.text})}
            style={s.input} />
        </View>

        <View style={[s.inputContainer, s.marginTop5]}>
          <TextInput
            placeholder="confirm"
            secureTextEntry={true}
            onChange={(event) => this.setState({confirmPassword: event.nativeEvent.text})}
            style={s.input} />
        </View>

        <Text style={s.filler}></Text>

        <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                            style={[s.button, s.buttonPink, s.marginTop10]}
                            underlayColor='#E4396D'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>CHANGE</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  onSubmitPressed () {
    if (!this.state.newPassword || (this.state.hasPassword && !this.state.oldPassword)) {
      return this._appendError('not-complete');
    }

    if (!this.state.newPassword !== this.state.confirmPassword) {
      return this._appendError('not-same-password');
    }

    client.accountPassword(this.state.newPassword, this.state.oldPassword, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendMessage('Success');
      }
    }, this));
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }

  _appendMessage(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({messages: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = ChangePasswordView;


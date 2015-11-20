var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ToastAndroid
  } = React;

var currentUser = require('../models/current-user');

class ForgotView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: [],
      hasPassword: false,
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      this.setState({
        load: true,
        hasPassword: !!response.account.has_password
      });
    }, this));
  }

  render () {
    if (!this.state.load) {
      return this.renderLoadingView();
    }

    var inputOldPassword;
    if (this.state.hasPassword) {
      inputOldPassword = <TextInput
        placeholder="Old password"
        secureTextEntry={true}
        onChange={(event) => this.setState({oldPassword: event.nativeEvent.text})}
        style={styles.formInput} />
    }

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Change password</Text>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          {inputOldPassword}
          <TextInput
            placeholder="New password"
            secureTextEntry={true}
            onChange={(event) => this.setState({newPassword: event.nativeEvent.text})}
            style={styles.formInput} />
          <TextInput
            placeholder="Confirm"
            secureTextEntry={true}
            onChange={(event) => this.setState({confirmPassword: event.nativeEvent.text})}
            style={styles.formInput} />
          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
            <Text style={styles.buttonText}>CHANGE</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
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
        this._appendError('Success');
      }
    }, this));
  }

  _appendError (string) {
    if (ToastAndroid) {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formInput: {
    height: 42,
    paddingBottom: 10,
    width: 250,
    marginRight: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  button: {
    height: 46,
    width: 250,
    backgroundColor: "#fd5286",
    borderRadius: 3,
    marginTop: 30,
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
  title: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: 'bold',
    color: "#111"
  }
});

module.exports = ForgotView;


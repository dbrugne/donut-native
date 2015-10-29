'use strict';

/**
 * https://medium.com/@ntoscano/react-native-persistent-user-login-6a48ff380ab8#.ojepkj31k
 * http://wiredify.com/shohey1226/logs/React-Native---Router-for-Login-status-using-Navigator
 * https://github.com/ntoscano/ReactNativePersistentUserLogin/blob/master/persistentUserLogin.js
 * https://blog.nraboy.com/2015/09/using-navigator-routes-in-your-react-native-application/
 */

var _ = require('underscore');
var React = require('react-native');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Navigator,
  AsyncStorage
} = React;

var currentUser = require('../models/current-user');

class LoginView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      hasPassword: false,
      messages: [],
      errors: []
    };
  }

  componentDidMount () {
    this.setState({
      email: currentUser.getEmail()
    });
  }

  render () {
    return (
      <View style={styles.container}>
        {this.state.errors.map((m) => <Text>{m}</Text>)}
        {this.state.messages.map((m) => <Text>{m}</Text>)}
        <Text style={styles.title}>
          Sign In
        </Text>
        <View>
          <TextInput
            placeholder="Email"
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            style={styles.formInput}
            value={this.state.email} />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            style={styles.formInput}
            value={this.state.password} />
          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  onSubmitPressed () {
    if (!this.state.email || !this.state.password) {
      return;
    }

    // @todo : loading screen
    var that = this;
    currentUser.login(this.state.email, this.state.password, _.bind(function (err) {
      if (err) {
        this._appendError(err);
      }
    }, this));
  }

  _appendMessage (string) {
    this.setState({messages: this.state.messages.concat(string)});
  }

  _appendError (string) {
    this.setState({errors: this.state.messages.concat(string)});
  }

};

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch"
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  formInput: {
    height: 36,
    padding: 10,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  button: {
    height: 36,
    flex: 1,
    backgroundColor: "#555555",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
});

module.exports = LoginView;

var _ = require('underscore');
var React = require('react-native');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ToastAndroid
  } = React;

var currentUser = require('../models/current-user');

class SignupView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      hasPassword: false,
      username: false,
      messages: [],
      errors: []
    };
  }

  render () {
    return (
      <View style={styles.container}>
        <View>
          <TouchableHighlight onPress={(this.onFacebookPressed.bind(this))} style={styles.buttonFacebook}>
            <Text style={styles.buttonText}>SIGN UP WITH FACEBOOK</Text>
          </TouchableHighlight>
          <Text style={styles.title}>
            OR
          </Text>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          {this.state.messages.map((m) => <Text>{m}</Text>)}
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
            <TextInput
              placeholder="Username"
              onChange={(event) => this.setState({username: event.nativeEvent.text})}
              style={styles.formInput}
              value={this.state.username} />
            <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
              <Text style={styles.buttonText}>HERE WE GO!</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  onSubmitPressed () {
    if (!this.state.email || !this.state.password || !this.state.username) {
      return this._appendError('not-complete');
    }

    currentUser.signUp(this.state.email, this.state.password, this.state.username, _.bind(function (err) {
      if (err) {
        this._appendError(err);
      } else {
        this._appendError('Success');
      }
    }, this));
  }

  onFacebookPressed () {
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
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111',
    alignSelf: "center",
    marginTop: 40
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
  buttonFacebook: {
    height: 46,
    width: 250,
    backgroundColor: "#4a649d",
    borderRadius: 3,
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
});

module.exports = SignupView;

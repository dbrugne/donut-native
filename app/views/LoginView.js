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
  AsyncStorage,
  BackAndroid,
  ToastAndroid
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
    if (BackAndroid) {
      BackAndroid.addEventListener('hardwareBackPress', _.bind(function () {
        var routes = this.props.navigator.getCurrentRoutes();
        if (routes && routes.length > 1) {
          this.props.navigator.popToTop().bind(this);
        }
      }, this));
    }
  }

  componentWillUnmount () {
    if (BackAndroid) {
      BackAndroid.removeEventListener('hardwareBackPress', _.bind(function () {
      }, this));
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View>
          <TouchableHighlight onPress={(this.onFacebookPressed.bind(this))} style={styles.buttonFacebook}>
            <Text style={styles.buttonText}>SIGN IN WITH FACEBOOK</Text>
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
            <TouchableHighlight onPress={(this.onForgotPressed.bind(this))} style={styles.forgot}>
              <Text style={styles.link}>FORGOT PASSWORD</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
              <Text style={styles.buttonText}>HERE WE GO!</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight onPress={(this.onCreatePressed.bind(this))} style={styles.create}>
            <Text style={styles.link}>I don't have an account yet. Create one</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  onSubmitPressed () {
    if (!this.state.email || !this.state.password) {
      return this._appendError('not-complete');
    }

    // @todo : loading screen
    var that = this;
    currentUser.login(this.state.email, this.state.password, _.bind(function (err) {
      if (err) {
        this._appendError(err);
      }
    }, this));
  }

  onFacebookPressed () {
  }

  onForgotPressed () {
    this.props.navigator.push({
      title: 'Forgot',
      component: require('../views/ForgotView')
    });
  }

  onCreatePressed () {
    this.props.navigator.push({
      title: 'Create',
      component: require('../views/SignupView')
    });
  }

  _appendMessage (string) {
    this.setState({messages: this.state.messages.concat(string)});
  }

  _appendError (string) {
    if (ToastAndroid) {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    fontSize: 15
  },
  forgot: {
    alignSelf: 'flex-end',
    marginRight: 28
  },
  create: {
    marginTop: 25,
    alignSelf: 'center'
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111',
    alignSelf: "center",
    marginTop: 20
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

module.exports = LoginView;

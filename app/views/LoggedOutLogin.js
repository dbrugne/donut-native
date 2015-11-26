'use strict';

/**
 * https://medium.com/@ntoscano/react-native-persistent-user-login-6a48ff380ab8#.ojepkj31k
 * http://wiredify.com/shohey1226/logs/React-Native---Router-for-Login-status-using-Navigator
 * https://github.com/ntoscano/ReactNativePersistentUserLogin/blob/master/persistentUserLogin.js
 * https://blog.nraboy.com/2015/09/using-navigator-routes-in-your-react-native-application/
 */

var _ = require('underscore');
var React = require('react-native');
var SignupView = require('./LoggedOutSignup');
var ForgotView = require('./LoggedOutForgot');
var Platform = require('Platform');
var s = require('../styles/style');

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
  ToastAndroid,
  Image
  } = React;
var {
  Icon
  } = require('react-native-icons');


var currentUser = require('../models/mobile-current-user');

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      hasPassword: false,
      messages: [],
      errors: []
    };
  }

  componentDidMount() {
    this.setState({
      email: currentUser.getEmail()
    });
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', _.bind(function () {
        var routes = this.props.navigator.getCurrentRoutes();
        if (routes && routes.length > 1) {
          // @todo yfuks: pourquoi pas juste this.props.navigator.pop() ?
          this.props.navigator.popToTop().bind(this);
        }
      }, this));
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', _.bind(function () {
      }, this));
    }
  }

  render() {
    var messages = null;
    if ((this.state.errors && this.state.errors.length > 0) || (this.state.messages && this.state.messages.length > 0)) {
      messages = (
        <View style={s.alertError}>
          {this.state.errors.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
          {this.state.messages.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
        </View>
      );
    }

    return (
      <View style={styles.main}>
        <View style={styles.container}>
          <View style={styles.flexible}>
            <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
          </View>

          <TouchableHighlight onPress={(this.onFacebookPressed.bind(this))}
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
              <Text style={[s.buttonText, styles.buttonTextFacebook]}>Sign-in with Facebook</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.orContainer}>
            <Text style={s.title}> OR </Text>
          </View>

          {messages}

          <TextInput
            placeholder="Email"
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            style={s.input}
            value={this.state.email}/>

          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            style={[s.input, styles.marginTop5]}
            value={this.state.password}/>

          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                              style={[s.button, s.buttonPink, styles.marginTop5]}
                              underlayColor='#E4396D'
            >
              <View style={s.buttonLabel}>
                <Text style={s.buttonTextLight}>Sign In</Text>
              </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={(this.onForgotPressed.bind(this))}
                              underlayColor='transparent'
                              style={[styles.marginTop10, styles.centered]}>
            <Text style={s.link}>Forgot your password ?</Text>
          </TouchableHighlight>

          <View style={[styles.marginTop5, styles.linkCtn]} >
            <Text style={styles.textGray}>Don't have an account ? </Text>
            <TouchableHighlight onPress={(this.onCreatePressed.bind(this))}
                                underlayColor='transparent'
                                style={styles.centered}>
              <Text style={s.link}>Sign Up</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  onSubmitPressed() {
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

  onFacebookPressed() {
  }

  onForgotPressed() {
    this.props.navigator.push({
      title: 'Forgot',
      component: ForgotView
    });
  }

  onCreatePressed() {
    this.props.navigator.push({
      title: 'Create',
      component: SignupView
    });
  }

  _appendMessage(string) {
    this.setState({messages: this.state.messages.concat(string)});
  }

  _appendError(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }

}
;

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex:1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 40
  },
  logo: {
    width: 250,
    height: 64,
    alignSelf: 'center'
  },
  orContainer: {
    padding: 10,
    marginVertical:10
  },
  link: {
    fontSize: 15,
    marginTop: 10
  },
  centered: {
    alignSelf: 'center'
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: "center"
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
  icon: {
    width: 28,
    height: 28
  },
  iconContainer: {
    justifyContent: 'flex-end',
    borderRightWidth: 2,
    borderColor: '#344B7D',
    borderStyle: 'solid',
    marginRight: 5
  },
  iconFacebook: {
    paddingRight: 5,
    marginRight: 5,
    alignSelf: 'flex-end'
  },
  marginTop5: {
    marginTop: 5
  },
  marginTop10: {
    marginTop: 10
  },
  flexible: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  }
});

module.exports = LoginView;

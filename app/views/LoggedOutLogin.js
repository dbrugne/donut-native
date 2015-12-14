'use strict';

var React = require('react-native');
var SignupView = require('./LoggedOutSignup');
var ForgotView = require('./LoggedOutForgot');
var Platform = require('Platform');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var _ = require('underscore');
var $ = require('jquery');
var Button = require('../elements/Button');
var Link = require('../elements/Link');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'forgot': 'Forgot your password ?',
  'account': 'Don\'t have an account ? ',
  'signup': 'Sign up',
  'signin': 'Sign in',
  'password': 'Password',
  'mail': 'Mail'
});

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  BackAndroid,
  Image
  } = React;

var currentUser = require('../models/mobile-current-user');
var FacebookLogin = require('../components/FacebookLogin');
var t = null;

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      hasPassword: false
    };
  }

  componentDidMount() {
    this.setState({
      email: currentUser.getEmail()
    });
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => {
        var routes = this.props.navigator.getCurrentRoutes();
        if (routes && routes.length > 1) {
          this.props.navigator.pop();
        }
      });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', () => {
      });
    }
  }

  render() {
    if (!currentUser.hasFacebookToken()) {
      var loginForm = (
        <View>
          <View style={styles.orContainer}>
            <Text style={styles.title}> {i18next.t('local:or')} </Text>
          </View>
          <View style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              placeholder={i18next.t('local:mail')}
              onChange={(event) => this.setState({email: event.nativeEvent.text})}
              style={s.input}
              onSubmitEditing={() => this._focusNextField('1')}
              value={this.state.email}/>
          </View>
          <View style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              ref='1'
              placeholder={i18next.t('local:password')}
              secureTextEntry={true}
              onChange={(event) => this.setState({password: event.nativeEvent.text})}
              style={[s.input, s.marginTop5]}
              value={this.state.password}/>
          </View>

          <Button onPress={(this.onSubmitPressed.bind(this))}
                  style={s.marginTop5}
                  type='pink'
                  label={i18next.t('local:signin')}/>

          <Link onPress={(this.onForgotPressed.bind(this))}
                text={i18next.t('local:forgot')}
                style={[s.marginTop10, styles.centered]}
                linkStyle={s.link}
                type='bold'
            />

        </View>
      );

      var signupButton = (
        <View style={styles.linkCtn}>
          <Text style={styles.textGray}>{i18next.t('local:account')}</Text>

          <Link onPress={(this.onCreatePressed.bind(this))}
                text={i18next.t('local:signup')}
                style={[s.marginTop10, styles.centered]}
                linkStyle={s.link}
                type='bold'
            />
        </View>
      );
    }

    return (
      <View style={styles.main}>
        <View style={styles.logoCtn}>
          <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <FacebookLogin />
            {loginForm}
          </View>
        </ScrollView>
        {signupButton}
      </View>
    );
  }

  onSubmitPressed() {
    if (!this.state.email || !this.state.password) {
      return Alert.show(i18next.t('messages.not-complete'));
    }

    // @todo : loading screen
    currentUser.emailLogin(this.state.email, this.state.password, (err) => {
      if (err) {
        Alert.show(i18next.t('messages.' + err));
      }
    });
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

  _focusNextField(nextField) {
    this.refs[nextField].focus()
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FAF9F5'
  },
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
  logoCtn: {
    marginTop: 50,
    paddingBottom: 25,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3'
  },
  logo: {
    width: 125,
    height: 32,
    alignSelf: 'center'
  },
  orContainer: {
    padding: 5,
    marginBottom: 5
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
  flexible: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3',
    paddingTop: 10,
    paddingBottom: 10
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  }
});

module.exports = LoginView;

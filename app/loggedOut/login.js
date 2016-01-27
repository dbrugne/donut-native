'use strict';

var React = require('react-native');
var SignupView = require('./signup');
var ForgotView = require('./forgot');
var EutcView = require('./eutc');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var Button = require('../components/Button');
var Link = require('../components/Link');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'login', {
  'forgot': 'Forgot your password ?',
  'or': 'or',
  'account': 'Don\'t have an account ? ',
  'signup': 'Sign up',
  'signin': 'Sign in',
  'password': 'Password',
  'mail': 'Mail',
  'eutc': 'EUTC'
});

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  Image
  } = React;

var currentUser = require('../models/current-user');
var FacebookLogin = require('../components/FacebookLogin');
var LoadingModal = require('../components/LoadingModal');

class LoginView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      hasPassword: false,
      showLoadingModal: false
    };
  }

  componentDidMount () {
    this.setState({
      email: currentUser.getEmail()
    });
  }

  render () {
    if (!currentUser.hasFacebookToken()) {
      var loginForm = (
        <View>
          <View style={styles.orContainer}>
            <Text style={styles.title}> {i18next.t('login:or')} </Text>
          </View>
          <View
            ref='email'
            style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              ref='1'
              autoCapitalize='none'
              placeholder={i18next.t('login:mail')}
              onChange={(event) => this.setState({email: event.nativeEvent.text})}
              style={s.input}
              keyboardType='email-address'
              onSubmitEditing={() => this._focusNextField('2')}
              onFocus={this.inputFocused.bind(this, 'email')}
              onBlur={this.inputBlured.bind(this, 'email')}
              returnKeyType='next'
              value={this.state.email}/>
          </View>
          <View
            ref='password'
            style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              ref='2'
              autoCapitalize='none'
              placeholder={i18next.t('login:password')}
              secureTextEntry={true}
              onChange={(event) => this.setState({password: event.nativeEvent.text})}
              style={[s.input, s.marginTop5]}
              onFocus={this.inputFocused.bind(this, 'password')}
              onBlur={this.inputBlured.bind(this, 'password')}
              returnKeyType='done'
              value={this.state.password}/>
          </View>

          <Button onPress={(this.onSubmitPressed.bind(this))}
                  style={s.marginTop10}
                  type='pink'
                  label={i18next.t('login:signin')}/>

          <Link onPress={(this.onForgotPressed.bind(this))}
                text={i18next.t('login:forgot')}
                style={[s.marginTop10, styles.centered]}
                linkStyle={s.link}
                type='bold'
            />

        </View>
      );
    }

    return (
      <View style={{flex: 1, alignItems: 'stretch'}}>
        <ScrollView
          ref='scrollView'
          contentContainerStyle={{flex:1}}
          keyboardDismissMode='on-drag'
          style={{flex: 1, backgroundColor: '#FAF9F5'}}>
          <View>
            <View style={styles.logoCtn}>
              <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
            </View>
            <View style={styles.container}>
              <FacebookLogin showLoadingModal={() => this.setState({showLoadingModal: true})}
                             hideLoadingModal={() => this.setState({showLoadingModal: false})}/>
              {loginForm}
            </View>
            <View style={styles.linkCtn}>
              <Link onPress={(this.onCreatePressed.bind(this))}
                    text={i18next.t('login:signup')}
                    style={[s.marginTop10, styles.centered]}
                    linkStyle={s.link}
                    prepend={i18next.t('login:account')}
                    prependStyle={styles.textGray}
                    type='bold'
                />
            </View>
            <Link onPress={(this.onEutcPressed.bind(this))}
                  text={i18next.t('login:eutc')}
                  style={styles.centered}
                  linkStyle={s.link}
                  type='bold'
              />
          </View>
        </ScrollView>
        {this.state.showLoadingModal ? <LoadingModal /> : null}
      </View>
    );
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

  _updateScroll (refName, offset) {
    let scrollResponder = this.refs.scrollView.getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(this.refs[refName]),
      offset,
      true
    );
  }

  _focusNextField (nextField) {
    this.refs[nextField].focus()
  }

  onSubmitPressed () {
    if (!this.state.email || !this.state.password) {
      return Alert.show(i18next.t('messages.not-complete'));
    }

    this.setState({showLoadingModal: true});
    currentUser.emailLogin(this.state.email, this.state.password, (err) => {
      this.setState({showLoadingModal: false});
      if (err) {
        Alert.show(i18next.t('messages.' + err));
      }
    });
  }

  onForgotPressed () {
    this.props.navigator.push({
      title: 'Forgot',
      component: ForgotView
    });
  }

  onCreatePressed () {
    this.props.navigator.push({
      title: 'Create',
      component: SignupView
    });
  }

  onEutcPressed () {
    this.props.navigator.push({
      title: 'EUTC',
      component: EutcView
    });
  }
}

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

LoginView.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number])
};

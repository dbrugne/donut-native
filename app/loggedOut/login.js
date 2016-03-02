'use strict';

var React = require('react-native');
var SignupView = require('./signup');
var ForgotView = require('./forgot');
var EutcView = require('./eutc');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var Button = require('../components/Button');
var Link = require('../components/Link');
var animation = require('../libs/animations').homepageLogo;
var currentUser = require('../models/current-user');
var FacebookLogin = require('../components/FacebookLogin');
var LoadingModal = require('../components/LoadingModal');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'login', {
  'forgot': 'Forgot your password ?',
  'or': 'OR',
  'account': 'Don\'t have an account ? ',
  'signup': 'Sign Up',
  'signin': 'SIGN IN',
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
  Image,
  LayoutAnimation,
  TouchableHighlight
} = React;

class LoginView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      hasPassword: false,
      showLoadingModal: false,
      editing: false
    };
  }

  componentDidMount () {
    this.setState({
      email: currentUser.getEmail()
    });
  }

  render () {
    if (this.state.showLoadingModal) {
      return (<LoadingModal />);
    }

    return (
      <View style={{flex: 1, alignItems: 'stretch', position: 'relative'}}>
        <Image source={require('../assets/background.jpg')} style={{position: 'absolute', resizeMode:'stretch'}} />
        <ScrollView
          ref='scrollView'
          contentContainerStyle={{flex:1}}
          keyboardDismissMode='on-drag'
          style={{flex: 1}}>

          <View style={styles.logoCtn}>
            <Image source={require('../assets/logo-bordered.png')} style={[styles.logo, this.state.editing && styles.logoSmall]}/>
          </View>

          <View style={styles.container}>
            <FacebookLogin showLoadingModal={() => this.setState({showLoadingModal: true})}
                           hideLoadingModal={() => this.setState({showLoadingModal: false})}
              />
            {this._renderLoginForm()}
          </View>

          <View style={[styles.linkCtn, { marginBottom: 10 }]}>
            <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#FFFFFF'}}>{i18next.t('login:account')}</Text>
            <TouchableHighlight onPress={(this.onCreatePressed.bind(this))}
                                underlayColor='transparent'
              >
              <View>
                <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#FFFFFF', fontWeight: 'bold'}}>
                  {i18next.t('login:signup')}
                </Text>
              </View>
            </TouchableHighlight>
            <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#FFFFFF'}}> | </Text>

            <TouchableHighlight onPress={(this.onEutcPressed.bind(this))}
                                underlayColor='transparent'
              >
              <View>
                <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#FFFFFF', fontWeight: 'bold'}}>
                  {i18next.t('login:eutc')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }

  _renderLoginForm() {
    if (currentUser.hasFacebookToken()) {
      return null;
    }

    return (
      <View>
        <View style={styles.orContainer}>
          <Text style={{fontSize: 14, alignSelf: "center", fontFamily: "Open Sans", color: "#AFBAC8" }}> {i18next.t('login:or')} </Text>
        </View>

        <View style={{flex:1}} />

        <View style={[{ padding:2, borderRadius:4, backgroundColor: '#FFF'}, styles.shadow]}>
          <TextInput
            ref='1'
            autoCapitalize='none'
            placeholder={i18next.t('login:mail')}
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            style={{ backgroundColor: '#FFF', color: "#AFBAC8", height: 40, paddingBottom: 3, paddingTop: 3, paddingLeft: 10, paddingRight: 10, fontFamily: 'Open Sans', fontSize: 14, flex: 1 }}
            keyboardType='email-address'
            onSubmitEditing={() => this._focusNextField('2')}
            onFocus={this.inputFocused.bind(this, 'email')}
            onBlur={this.inputBlured.bind(this, 'email')}
            returnKeyType='next'
            value={this.state.email}/>
          <View style={{height:1, backgroundColor: '#E7ECF3'}} />
          <TextInput
            ref='2'
            autoCapitalize='none'
            placeholder={i18next.t('login:password')}
            secureTextEntry={true}
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            style={{ backgroundColor: '#FFF', color: "#AFBAC8", height: 40, paddingBottom: 3, paddingTop: 3, paddingLeft: 10, paddingRight: 10, fontFamily: 'Open Sans', fontSize: 14, flex: 1 }}
            onFocus={this.inputFocused.bind(this, 'password')}
            onBlur={this.inputBlured.bind(this, 'password')}
            returnKeyType='done'
            value={this.state.password}/>
        </View>

        <Button onPress={(this.onSubmitPressed.bind(this))}
                style={{marginTop:15}}
                buttonStyle={[{borderRadius:4}, styles.shadow]}
                type='pink'
                label={i18next.t('login:signin')}
          />


        <TouchableHighlight style={{ marginTop: 30 }}
                            onPress={(() => this.onForgotPressed())}
                            underlayColor='transparent'
          >
          <View>
            <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold'}}>
              {i18next.t('login:forgot')}
            </Text>
          </View>
        </TouchableHighlight>

      </View>
    );
  }

  inputFocused (refName) {
    LayoutAnimation.configureNext(animation);
    this.setState({
      editing: true
    });
  }

  inputBlured (refName) {
    LayoutAnimation.configureNext(animation);
    this.setState({
      editing: false
    });
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
    justifyContent: 'center'
  },
  logoCtn: {
    marginTop: 50,
    paddingBottom: 25,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  logo: {
    width: 200,   // 400
    height: 50,   // 101
    alignSelf: 'center'
  },
  logoSmall: {
    width: 100,
    height: 25
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
  iconContainer: {
    justifyContent: 'flex-end',
    marginRight: 5
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  },
  shadow: {
    shadowColor: 'rgb(30,30,30)',
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.75
  }
});

module.exports = LoginView;

LoginView.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number])
};

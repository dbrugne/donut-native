'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Image,
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var currentUser = require('../models/current-user');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var Button = require('../components/Button');
var Link = require('../components/Link');
var LoadingModal = require('../components/LoadingModal');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'signup', {
  'back': 'Back',
  'signup': 'Sign up',
  'username': 'Username',
  'password': 'Password',
  'mail': 'Mail'
});

class Signup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      hasPassword: false,
      username: '',
      showLoadingModal: false
    };
  }

  render () {
    return (
      <View style={{flex: 1, alignItems: 'stretch'}}>
        <View style={styles.linkCtn} >
          <Icon
            name='chevron-left'
            size={14}
            color='#808080'
            style={{marginTop: 2, marginRight: 2}}
          />
          <Link onPress={(this.onBack.bind(this))}
                text={i18next.t('signup:back')}
                linkStyle={[s.link, styles.textGray]}
                type='bold'
            />
        </View>
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
              <View ref='email'
                    style={[s.inputContainer, s.marginTop10]}>
                <TextInput
                  autoCapitalize='none'
                  placeholder={i18next.t('signup:mail')}
                  onChange={(event) => this.setState({email: event.nativeEvent.text})}
                  style={s.input}
                  onSubmitEditing={() => this._focusNextField('1')}
                  returnKeyType='next'
                  keyboardType='email-address'
                  onFocus={this.inputFocused.bind(this, 'email')}
                  onBlur={this.inputBlured.bind(this, 'email')}
                  value={this.state.email} />
              </View>

              <View
                ref='password'
                style={[s.inputContainer, s.marginTop10]}>
                <TextInput
                  ref='1'
                  autoCapitalize='none'
                  placeholder={i18next.t('signup:password')}
                  secureTextEntry={true}
                  onChange={(event) => this.setState({password: event.nativeEvent.text})}
                  style={s.input}
                  onSubmitEditing={() => this._focusNextField('2')}
                  returnKeyType='next'
                  keyboardType='default'
                  onFocus={this.inputFocused.bind(this, 'password')}
                  onBlur={this.inputBlured.bind(this, 'password')}
                  value={this.state.password} />
              </View>

              <View ref='username'
                    style={[s.inputContainer, s.marginTop10]}>
                <TextInput
                  ref='2'
                  autoCapitalize='none'
                  placeholder={i18next.t('signup:username')}
                  onChange={(event) => this.setState({username: event.nativeEvent.text})}
                  style={s.input}
                  returnKeyType='done'
                  keyboardType='default'
                  onFocus={this.inputFocused.bind(this, 'username')}
                  onBlur={this.inputBlured.bind(this, 'username')}
                  value=  {this.state.username} />
              </View>

              <Button onPress={(this.onSubmitPressed.bind(this))}
                      style={s.marginTop10}
                      type='pink'
                      label={i18next.t('signup:signup')}/>

            </View>
          </View>
        </ScrollView>
        {this.state.showLoadingModal ? <LoadingModal /> : null}
      </View>
    );
  }

  onBack() {
    this.props.navigator.pop();
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

  onSubmitPressed () {
    if (!this.state.email || !this.state.password || !this.state.username) {
      return Alert.show(i18next.t('messages.not-complete'));
    }

    this.setState({showLoadingModal: true});
    currentUser.emailSignUp(this.state.email, this.state.password, this.state.username, (err) => {
      this.setState({showLoadingModal: false});
      if (err) {
        Alert.show(i18next.t('messages.' + err));
      }
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex:1,
    backgroundColor: '#FAF9F5'
  },
  container: {
    paddingLeft:20,
    paddingRight:20,
    paddingTop:10,
    paddingBottom:10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  logo: {
    width: 125,
    height: 32,
    alignSelf: 'center'
  },
  logoCtn: {
    marginTop: 50,
    paddingBottom:25,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3'
  },
  iconContainer: {
    justifyContent: 'flex-end',
    borderRightWidth: 2,
    borderColor: '#344B7D',
    borderStyle: 'solid',
    marginRight: 5
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: "center"
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF'
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  }
});

module.exports = Signup;

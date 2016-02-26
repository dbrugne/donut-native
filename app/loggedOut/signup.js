'use strict';

var React = require('react-native');
var currentUser = require('../models/current-user');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var Button = require('../components/Button');
var Link = require('../components/Link');
var LoadingModal = require('../components/LoadingModal');
var animation = require('../libs/animations').homepageLogo;

var {
  Component,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Image,
  LayoutAnimation,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/EvilIcons');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'signup', {
  'signup': 'SIGN UP',
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
      showLoadingModal: false,
      editing: false
    };
  }

  render () {
    if (this.state.showLoadingModal) {
      return (<LoadingModal />);
    }

    return (
      <View style={{flex: 1, alignItems: 'stretch', position: 'relative'}}>
        <Image source={require('../assets/background.jpg')} style={{position: 'absolute', resizeMode:'stretch'}} />

        <View style={[styles.linkCtn, {marginTop:15, paddingLeft:10, backgroundColor: 'transparent'}]} >
          <TouchableHighlight onPress={(this.onBack.bind(this))}
                              underlayColor='transparent'
            >
            <View>
              <Icon
                name='chevron-left'
                size={50}
                color='#FC2063'
                style={{marginTop: 2, marginRight: 2}}
                />
            </View>
          </TouchableHighlight>
        </View>

        <ScrollView ref='scrollView' contentContainerStyle={{flex:1}} keyboardDismissMode='on-drag' style={{flex: 1}}>

          <View style={styles.logoCtn}>
            <Image source={require('../assets/logo-bordered.png')} style={[styles.logo, this.state.editing && styles.logoSmall]}/>
          </View>

          <View style={{flex:1}} />

          <View style={styles.container}>
            <View style={[{ padding:2, borderRadius:4, backgroundColor: '#FFF'}, styles.shadow]}>
              <TextInput
                autoCapitalize='none'
                placeholder={i18next.t('signup:mail')}
                onChange={(event) => this.setState({email: event.nativeEvent.text})}
                style={{ backgroundColor: '#FFF', color: "#AFBAC8", height: 40, paddingBottom: 3, paddingTop: 3, paddingLeft: 10, paddingRight: 10, fontFamily: 'Open Sans', fontSize: 14, flex: 1 }}
                onSubmitEditing={() => this._focusNextField('1')}
                returnKeyType='next'
                keyboardType='email-address'
                onFocus={this.inputFocused.bind(this, 'email')}
                onBlur={this.inputBlured.bind(this, 'email')}
                value={this.state.email} />
              <TextInput
                ref='1'
                autoCapitalize='none'
                placeholder={i18next.t('signup:password')}
                secureTextEntry
                onChange={(event) => this.setState({password: event.nativeEvent.text})}
                style={{ backgroundColor: '#FFF', color: "#AFBAC8", height: 40, paddingBottom: 3, paddingTop: 3, paddingLeft: 10, paddingRight: 10, fontFamily: 'Open Sans', fontSize: 14, flex: 1 }}
                onSubmitEditing={() => this._focusNextField('2')}
                returnKeyType='next'
                keyboardType='default'
                onFocus={this.inputFocused.bind(this, 'password')}
                onBlur={this.inputBlured.bind(this, 'password')}
                value={this.state.password} />
              <TextInput
                ref='2'
                autoCapitalize='none'
                placeholder={i18next.t('signup:username')}
                onChange={(event) => this.setState({username: event.nativeEvent.text})}
                style={{ backgroundColor: '#FFF', color: "#AFBAC8", height: 40, paddingBottom: 3, paddingTop: 3, paddingLeft: 10, paddingRight: 10, fontFamily: 'Open Sans', fontSize: 14, flex: 1 }}
                returnKeyType='done'
                keyboardType='default'
                onFocus={this.inputFocused.bind(this, 'username')}
                onBlur={this.inputBlured.bind(this, 'username')}
                value={this.state.username} />
            </View>

            <Button onPress={(this.onSubmitPressed.bind(this))}
                    style={{marginTop:15}}
                    buttonStyle={[{borderRadius:4}, styles.shadow]}
                    type='pink'
                    label={i18next.t('signup:signup')}/>

          </View>

          <View style={{flex:1}} />

        </ScrollView>
      </View>
    );
  }

  onBack () {
    this.props.navigator.pop();
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
    this.refs[nextField].focus();
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
  logo: {
    width: 200,   // 400
    height: 50,   // 101
    alignSelf: 'center'
  },
  logoSmall: {
    width: 100,
    height: 25
  },
  logoCtn: {
    marginTop: 50,
    paddingBottom: 25,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
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
    alignSelf: 'center'
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
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

module.exports = Signup;

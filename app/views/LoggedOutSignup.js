'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
} = React;
var {
  Icon
} = require('react-native-icons');

var Platform = require('Platform');
var currentUser = require('../models/current-user');
var s = require('../styles/style');
var _ = require('underscore');
var Alert = require('../libs/alert');
var Button = require('../elements/Button');
var Link = require('../elements/Link');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
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
      username: false
    };
  }

  render () {
    return (
      <View style={styles.main}>
        <View style={styles.logoCtn}>
          <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
        </View>

        <View style={styles.container}>
          <View style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              autoFocus={true}
              placeholder={i18next.t('local:mail')}
              onChange={(event) => this.setState({email: event.nativeEvent.text})}
              style={s.input}
              onSubmitEditing={() => this._focusNextField('1')}
              value={this.state.email} />
          </View>

          <View style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              ref='1'
              placeholder={i18next.t('local:password')}
              secureTextEntry={true}
              onChange={(event) => this.setState({password: event.nativeEvent.text})}
              style={s.input}
              onSubmitEditing={() => this._focusNextField('2')}
              value={this.state.password} />
          </View>

          <View style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              ref='2'
              placeholder={i18next.t('local:username')}
              onChange={(event) => this.setState({username: event.nativeEvent.text})}
              style={s.input}
              value=  {this.state.username} />
          </View>

          <Button onPress={(this.onSubmitPressed.bind(this))}
                  style={s.marginTop5}
                  type='pink'
                  label={i18next.t('local:signup')}/>

        </View>

        <View style={styles.linkCtn} >
          <Icon
            name='fontawesome|chevron-left'
            size={14}
            color='#808080'
            style={styles.icon}
            />
          <Link onPress={(this.onBack.bind(this))}
                text={i18next.t('local:back')}
                style={[styles.textGray]}
                linkStyle={s.link}
                type='bold'
            />
        </View>
      </View>
    );
  }

  onBack() {
    this.props.navigator.pop();
  }

  onSubmitPressed () {
    if (!this.state.email || !this.state.password || !this.state.username) {
      return Alert.show(i18next.t('messages.not-complete'));
    }

    currentUser.emailSignUp(this.state.email, this.state.password, this.state.username, (err) => {
      if (err) {
        Alert.show(err);
      }
    });
  }

  _focusNextField(nextField) {
    this.refs[nextField].focus()
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
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft:5
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  },
  icon: {
    width: 14,
    height: 14
  }
});

module.exports = Signup;

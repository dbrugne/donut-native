'use strict';

var React = require('react-native');
var SignupView = require('./LoggedOutSignup');
var ForgotView = require('./LoggedOutForgot');
var Platform = require('Platform');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var _ = require('underscore');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  View,
  Navigator,
  AsyncStorage,
  BackAndroid,
  Image
} = React;

var currentUser = require('../models/mobile-current-user');
var FacebookLogin = require('../components/FacebookLogin');

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
    BackAndroid.removeEventListener('hardwareBackPress', () => {});
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.logoCtn}>
          <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <FacebookLogin />

            <View style={styles.orContainer}>
              <Text style={styles.title}> OR </Text>
            </View>

            <View style={[s.inputContainer, s.marginTop5]}>
              <TextInput
                placeholder="Email"
                onChange={(event) => this.setState({email: event.nativeEvent.text})}
                style={s.input}
                onSubmitEditing={() => this._focusNextField('1')}
                value={this.state.email}/>
            </View>

            <View style={[s.inputContainer, s.marginTop5]}>
              <TextInput
                ref='1'
                placeholder="Password"
                secureTextEntry={true}
                onChange={(event) => this.setState({password: event.nativeEvent.text})}
                style={[s.input, s.marginTop5]}
                value={this.state.password}/>
            </View>

            <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                                style={[s.button, s.buttonPink, s.marginTop5]}
                                underlayColor='#E4396D'
              >
              <View style={s.buttonLabel}>
                <Text style={s.buttonTextLight}>Sign In</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={(this.onForgotPressed.bind(this))}
                                underlayColor='transparent'
                                style={[s.marginTop10, styles.centered]}>
              <Text style={s.link}>Forgot your password ?</Text>
            </TouchableHighlight>

          </View>
        </ScrollView>
        
        <View style={styles.linkCtn} >
          <Text style={styles.textGray}>Don't have an account ? </Text>
          <TouchableHighlight onPress={(this.onCreatePressed.bind(this))}
                              underlayColor='transparent'
                              style={styles.centered}>
            <Text style={s.link}>Sign Up</Text>
          </TouchableHighlight>
        </View>

      </View>
    );
  }

  onSubmitPressed() {
    if (!this.state.email || !this.state.password) {
      return Alert.show('not-complete');
    }

    // @todo : loading screen
    currentUser.login(this.state.email, this.state.password, (err) => {
      if (err) {
        Alert.show(err);
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
  logo: {
    width: 125,
    height: 32,
    alignSelf: 'center'
  },
  orContainer: {
    padding: 5,
    marginBottom:5
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
    flex:1,
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

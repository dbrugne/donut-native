var _ = require('underscore');
var React = require('react-native');
var Platform = require('Platform');
var currentUser = require('../models/mobile-current-user');
var s = require('../styles/style');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  ToastAndroid
  } = React;
var {
  Icon
  } = require('react-native-icons');


// @todo : ykufs how to go back to login??

class Signup extends Component {
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
    var messages = null;
    if ((this.state.errors && this.state.errors.length > 0) || (this.state.messages && this.state.messages.length > 0)) {
      if (this.state.errors && this.state.errors.length > 0) {
        messages = (
          <View style={s.alertError}>
            {this.state.errors.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
          </View>
        );
      } else {
        messages = (
          <View style={s.alertSuccess}>
            {this.state.errors.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
          </View>
        );
      }
    }

    return (
      <View style={styles.main}>
        <View style={styles.logoCtn}>
          <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
        </View>

        <View style={styles.container}>
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
              <Text style={[s.buttonText, styles.buttonTextFacebook]}>Sign-up with Facebook</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.orContainer}>
            <Text style={styles.title}> OR </Text>
          </View>

          {messages}

          <TextInput
            placeholder="Email"
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            style={s.input}
            value={this.state.email} />

          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            style={s.input}
            value={this.state.password} />

          <TextInput
            placeholder="Username"
            onChange={(event) => this.setState({username: event.nativeEvent.text})}
            style={s.input}
            value={this.state.username} />



          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                              style={[s.button, s.buttonPink, styles.marginTop5]}
                              underlayColor='#E4396D'
            >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>Sign Up</Text>
            </View>
          </TouchableHighlight>

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
      }
    }, this));
  }

  onFacebookPressed () {
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  logo: {
    width: 250,
    height: 64,
    alignSelf: 'center'
  },
  logoCtn: {
    marginTop: 50,
    paddingBottom: 50,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3'
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
  orContainer: {
    padding: 10,
    marginVertical:10
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: "center"
  },
  marginTop5: {
    marginTop: 5
  },
  iconFacebook: {
    paddingRight: 5,
    marginRight: 5,
    alignSelf: 'flex-end'
  }
});

module.exports = Signup;

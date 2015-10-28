'use strict';

/**
 * Ideas https://github.com/ntoscano/ReactNativePersistentUserLogin/blob/master/persistentUserLogin.js
 */


var React = require('react-native');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Navigator,
  AsyncStorage
} = React;

var HomeView = require('./HomeView');
//var authentication = require('../models/authentication');

class LoginView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: 'yangs@yangs.net',
      password: 'password'
    };
  }
  componentDidMount() {
    this._loadInitialState().done();
  }
  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem('token');
      if (value !== null) {
        console.log('logged in', value);
        this.displayHomeView();
//        this._appendMessage('Recovered selection from disk: ' + value);
      } else {
        console.log('not logged in');
//        this._appendMessage('Initialized with no selection on disk.');
      }
    } catch (error) {
      console.error(error);
//      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Sign In
        </Text>
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
          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  onSubmitPressed () {
    if (this.state.email && this.state.password) {
      console.log('go', this.state.email, this.state.password);
      var params = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password
        })
      };
      var that = this;
      fetch('https://test.donut.me/oauth/get-token-from-credentials', params)
        .then(function(res) {
          return res.json();
        })
        .then(function(resJson) {
          try {
            that.saveStatus(resJson);
            return resJson;
          } catch (e) {
            console.error(e);
          }
        })
    }
  }
  async saveStatus(res) {
    console.log(res);
    try {
      await AsyncStorage.multiSet([
        ['token', res.token],
        ['code', res.code]
      ]);
      this.displayHomeView();
    } catch (error) {
//      this._appendMessage('AsyncStorage error: ' + error.message);
      console.error(error);
    }
  }
  displayHomeView() {
    console.log('go to home view');
    this.props.navigator.push({
      name: "Secure Page",
      component: HomeView,
      index: 1
    });
  }
};

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch"
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  formInput: {
    height: 36,
    padding: 10,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  button: {
    height: 36,
    flex: 1,
    backgroundColor: "#555555",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
});

module.exports = LoginView;

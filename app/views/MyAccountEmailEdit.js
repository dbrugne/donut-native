var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ToastAndroid
  } = React;

var currentUser = require('../models/mobile-current-user');

class EditEmailView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: []
    };
  }

  render () {
    var msg = (this.props.email.confirmed)
      ? 'This email was validated'
      : 'This email wasn\'t validated';

    return (
      <View style={s.main}>
        <View>
          <Text style={styles.title}>MANAGE EMAIL</Text>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          <Text style={[s.textCenter, styles.email]}>
            {this.props.email.email}
          </Text>
          <Text style={s.textCenter}>
            {msg}
          </Text>
          {
            this.props.email.confirmed
            ? <View></View>
            : <TouchableHighlight onPress= {(this.onSendEmail.bind(this))}
                                  style={[s.button, s.buttonPink, s.marginTop10]}
                                  underlayColor='#E4396D'
              >
                <View style={s.buttonLabel}>
                  <Text style={s.buttonTextLight}>SEND A VALIDATION EMAIL</Text>
                </View>
              </TouchableHighlight>
          }
          <TouchableHighlight onPress= {(this.onDeletePressed.bind(this))}
                              style={[s.button, s.buttonPink, s.marginTop10]}
                              underlayColor='#E4396D'
            >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>DELETE</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress= {() => this.props.navigator.pop()}
                              style={[s.button, s.buttonPink, s.marginTop5]}
                              underlayColor='#E4396D'
            >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>CANCEL</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  onDeletePressed () {
    client.accountEmail(this.props.email.email, 'delete', (response) => {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('Success');
        this.props.func();
        this.props.navigator.pop();
      }
    });
  }

  onSendEmail () {
    client.accountEmail(this.props.email.email, 'validate', (response) => {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('A validation email have been sent');
      }
    });
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.errors.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  title: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 40,
    fontWeight: 'bold',
    color: "#111"
  },
  email: {
    fontSize: 23,
    alignSelf: 'center',
    color: "#444",
    marginBottom: 40
  }
});

module.exports = EditEmailView;


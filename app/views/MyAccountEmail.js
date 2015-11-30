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

class ChangeEmailView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: this.props.email,
      errors: []
    };
  }

  render () {
    return (
      <View style={s.main}>
        <View>
          <Text style={styles.title}>Change main email</Text>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          <TextInput
            placeholder="Email"
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            style={styles.formInput}
            value={this.state.email} />
          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={[s.button, s.buttonPink, s.marginTop10]}>
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>SAVE</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => (this.props.navigator.pop())} style={[s.button, s.buttonPink, s.marginTop10]}>
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>CANCEL</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  onSubmitPressed () {
    if (!this.state.email) {
      return this._appendError('not-complete');
    }

    client.accountEmail(this.state.email, 'main', _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('Success');
        this.props.func();
        this.props.navigator.pop();
      }
    }, this));
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
  formInput: {
    height: 42,
    paddingBottom: 10,
    width: 250,
    marginRight: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555",
    alignSelf: 'center'
  },
  title: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: 'bold',
    color: "#111"
  }
});

module.exports = ChangeEmailView;

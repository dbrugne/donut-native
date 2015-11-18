var React = require('react-native');
var _ = require('underscore');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ToastAndroid
  } = React;


class ForgotView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      messages: [],
      errors: []
    };
  }

  render () {
    return (
      <View style={styles.container}>
        <View>
          <View>
            <Text style={styles.title}>Forgotten Password</Text>
            {this.state.errors.map((m) => <Text>{m}</Text>)}
            {this.state.messages.map((m) => <Text>{m}</Text>)}
            <TextInput
              placeholder="Email"
              onChange={(event) => this.setState({email: event.nativeEvent.text})}
              style={styles.formInput}
              value={this.state.email} />
            <TouchableHighlight onPress={(this.onResetPressed.bind(this))} style={styles.button}>
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  onResetPressed () {
    if (!this.state.email) {
      return this._appendError('not-complete');
    }

    currentUser.forgot(this.state.email, _.bind(function (err) {
      if (err) {
        this._appendError(err);
      } else {
        this._appendError('Success');
      }
    }, this));
  }

  _appendError (string) {
    if (ToastAndroid) {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
    color: "#555555"
  },
  button: {
    height: 46,
    width: 250,
    backgroundColor: "#fd5286",
    borderRadius: 3,
    marginTop: 30,
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
  title: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: 'bold',
    color: "#111"
  }
});

module.exports = ForgotView;

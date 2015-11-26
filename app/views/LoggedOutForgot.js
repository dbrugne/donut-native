var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
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
    var messages = null;
    if ((this.state.errors && this.state.errors.length > 0) || (this.state.messages && this.state.messages.length > 0)) {
      messages = (
        <View style={s.alertError}>
          {this.state.errors.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
          {this.state.messages.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
        </View>
      );
    }

    return (
      <View style={styles.main}>
        <View style={styles.container}>
          <View>
            <View>
              <Text style={[s.h1, s.textCenter]}>Forgot Password</Text>
              <Text style={[s.spacer, s.p, s.textCenter]}>What email address do you use to sign into Donut ?</Text>

              {messages}

              <TextInput
                placeholder="Email"
                onChange={(event) => this.setState({email: event.nativeEvent.text})}
                style={[s.input, s.spacer]}
                value={this.state.email} />

              <TouchableHighlight onPress={(this.onResetPressed.bind(this))}
                                  style={[s.button, s.buttonPink, styles.marginTop5]}
                                  underlayColor='#E4396D'
                >
                <View style={s.buttonLabel}>
                  <Text style={s.buttonTextLight}>Reset</Text>
                </View>
              </TouchableHighlight>
            </View>
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
    backgroundColor: '#F7F7F7'
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 40
  },
  marginTop5: {
    marginTop: 5
  }
});

module.exports = ForgotView;

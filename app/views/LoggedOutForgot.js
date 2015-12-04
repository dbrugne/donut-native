var React = require('react-native');
var Platform = require('Platform');
var s = require('../styles/style');
var Alert = require('../libs/alert');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  } = React;


class ForgotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.container}>
          <View>
            <View>
              <Text style={[s.h1, s.textCenter]}>Forgot Password</Text>
              <Text style={[s.spacer, s.p, s.textCenter]}>What email address do you use to sign into Donut ?</Text>

              <TextInput
                autoFocus={true}
                placeholder="Email"
                onChange={(event) => this.setState({email: event.nativeEvent.text})}
                style={[s.input, s.marginTop10]}
                value={this.state.email}/>

              <TouchableHighlight onPress={(this.onResetPressed.bind(this))}
                                  style={[s.button, s.buttonPink, s.marginTop5]}
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

  onResetPressed() {
    if (!this.state.email) {
      return Alert.show('not-complete');
    }

    currentUser.forgot(this.state.email, (err) => {
      if (err) {
        Alert.show(err);
      } else {
        Alert.show('Success');
      }
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 40
  }
});

module.exports = ForgotView;

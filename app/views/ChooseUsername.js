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

class ChooseUsername extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
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

          <View style={styles.flexible}>
            <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
          </View>

          {messages}

          <Text>Choisi ton username gros!</Text>

          <TextInput
            placeholder="Username"
            onChange={(event) => this.setState({username: event.nativeEvent.text})}
            style={s.input}
            value={this.state.username} />

          <TouchableHighlight onPress={(this.onSubmit.bind(this))}
                              style={[s.button, s.buttonPink, styles.marginTop5]}
                              underlayColor='#E4396D' >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>Save</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  onSubmit () {
    if (!this.state.username) {
      return this._appendError('not-complete');
    }

    // @todo now use client.userUpdate()
//    currentUser.saveUsername(this.state.username, (err) => {
//      if (err) {
//        this._appendError(err);
//      }
//    });
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
  logo: {
    width: 250,
    height: 64,
    alignSelf: 'center'
  },
  flexible: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
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
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: "center"
  },
  marginTop5: {
    marginTop: 5
  }
});

module.exports = ChooseUsername;

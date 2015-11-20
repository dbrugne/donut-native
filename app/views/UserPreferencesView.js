var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');

var {
  Component,
  Text,
  View,
  StyleSheet,
  SwitchAndroid,
  SwitchIOS,
  ToastAndroid
  } = React;

var currentUser = require('../models/current-user');

class UserPreferencesView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      'notif:channels:email': false,
      'notif:usermessage': false,
      'notif:invite': false,
      'notif:channels:mobile': false,
      loaded: false,
      errors: []
    };
  }

  componentDidMount () {
    client.userPreferencesRead(null, _.bind(function (data) {
      this.setState({
        'notif:channels:email': data.preferences['notif:channels:email'],
        'notif:usermessage': data.preferences['notif:usermessage'],
        'notif:invite': data.preferences['notif:invite'],
        'notif:channels:mobile': data.preferences['notif:channels:mobile'],
        loaded: true
      });
    }, this));
  }

  render () {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    var SwitchComponent;
    if (Platform.OS === 'android') {
      SwitchComponent = SwitchAndroid;
    } else {
      SwitchComponent = SwitchIOS;
    }
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Set preferences</Text>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          <Text style={styles.label}>Notify me:</Text>
          <View style={styles.row}>
            <View style={styles.rightContainer}>
              <SwitchComponent
                style={styles.switch}
                onValueChange={this._changePreferences.bind(this, 'notif:channels:email')}
                value={this.state['notif:channels:email']}
                />
            </View>
            <Text>on email (only if you are offline)</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rightContainer}>
              <SwitchComponent
                style={styles.switch}
                onValueChange={this._changePreferences.bind(this, 'notif:channels:mobile')}
                value={this.state['notif:channels:mobile']}
                />
            </View>
            <Text>on mobile</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rightContainer}>
              <SwitchComponent
                style={styles.switch}
                onValueChange={this._changePreferences.bind(this, 'notif:usermessage')}
                value={this.state['notif:usermessage']}
                />
            </View>
            <Text>when a user sends me a private message</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rightContainer}>
              <SwitchComponent
                style={styles.switch}
                onValueChange={this._changePreferences.bind(this, 'notif:invite')}
                value={this.state['notif:invite']}
                />
            </View>
            <Text>when a user invites me</Text>
          </View>
        </View>
      </View>
    )
  }

  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  _changePreferences (key) {
    this.setState({
      [key]: !this.state[key]
    });

    var update = {};
    update[key] = this.state[key];
    client.userPreferencesUpdate(update, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
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
  label: {
    flex: 1,
    flexDirection: 'row'
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
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  rightContainer: {
    flex: 1
  }
});

module.exports = UserPreferencesView;

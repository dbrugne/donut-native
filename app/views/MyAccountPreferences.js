var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var LoadingView = require('../components/Loading');
var s = require('../styles/style');
var currentUser = require('../models/mobile-current-user');
var ListGroupItem = require('../components/ListGroupItem');

var {
  Component,
  Text,
  View,
  StyleSheet,
  ToastAndroid,
  ListView,
  AlertIOS
  } = React;

class UserPreferencesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      errors: [],
      messages: [],
      preferences: {
        'notif:channels:email': false,
        'notif:channels:mobile': false,
        'notif:usermessage': false,
        'notif:invite': false
      }
    };
  }

  componentDidMount() {
    client.userPreferencesRead(null, (data) => {
      if (!data.preferences) {
        return;
      }

      var preferences = _.clone(this.state.preferences);

      _.each(preferences, (val, key) => {
        if (_.has(data.preferences, key)) {
          preferences[key] = data.preferences[key];
        }
      });

      this.setState({
        loaded: true,
        preferences
      });
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

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
      <View style={styles.container}>
        <Text style={[s.h1, s.textCenter, s.marginTop5]}>Set preferences</Text>

        {messages}

        <Text style={[s.listGroupTitle, s.marginTop20]}>NOTIFY ME</Text>
        <View style={s.listGroup}>

          <ListGroupItem text='on email (only if you are offline)'
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:channels:email')}
                         switchValue={this.state.preferences['notif:channels:email']}
            />

          <ListGroupItem text='on mobile'
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:channels:mobile')}
                         switchValue={this.state.preferences['notif:channels:mobile']}
            />

          <ListGroupItem text='when a user sends me a private message'
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:usermessage')}
                         switchValue={this.state.preferences['notif:usermessage']}
            />

          <ListGroupItem text='when a user invites me'
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:invite')}
                         switchValue={this.state.preferences['notif:invite']}
            />

        </View>
      </View>
    )
  }

  _changePreferences(key) {
    var newVal = !this.state.preferences[key];

    var update = {};
    update[key] = newVal;
    client.userPreferencesUpdate(update, (response) => {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendMessage('sauvegardé avec success');
      }

      var preferences = _.clone(this.state.preferences);
      preferences[key] = newVal;
      this.setState({
        preferences
      });
    });
  }

  _appendError(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(string)
    }
  }

  _appendMessage(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(string)
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = UserPreferencesView;

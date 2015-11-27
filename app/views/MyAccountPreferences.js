var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var LoadingView = require('../components/Loading');
var s = require('../styles/style');
var currentUser = require('../models/mobile-current-user');

var {
  Component,
  Text,
  View,
  StyleSheet,
  SwitchAndroid,
  SwitchIOS,
  ToastAndroid,
  ListView
  } = React;

var items = [
  {field: 'notif:channels:email', description: 'on email (only if you are offline)'},
  {field: 'notif:channels:mobile', description: 'on mobile'},
  {field: 'notif:usermessage', description: 'when a user sends me a private message'},
  {field: 'notif:invite', description: 'when a user invites me'}
];

class UserPreferencesView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      errors: [],
      messages: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    _.each(items, _.bind(function (i) {
      this.state[i.field] = false;
    }, this));
  }

  componentDidMount () {
    client.userPreferencesRead(null, _.bind(function (data) {
      var read = {loaded: true};
      _.each(items, _.bind(function (i) {
        read[i.field] = data.preferences[i.field];
      }, this));
      this.setState(read);
    }, this));
  }

  render () {
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
          <ListView
              dataSource={this.state.dataSource.cloneWithRows(items)}
              renderRow={this.renderElement.bind(this)}
            />
        </View>
      </View>
    )
  }

  renderElement (item) {
    var SwitchComponent;
    if (Platform.OS === 'android') {
      SwitchComponent = SwitchAndroid;
    } else {
      SwitchComponent = SwitchIOS;
    }

    return (
      <View style={s.listGroupItem}>
        <Text style={s.listGroupItemText}>{item.description}</Text>
        <SwitchComponent
          style={s.listGroupItemToggleRight}
          onValueChange={this._changePreferences.bind(this, item.field)}
          value={this.state[item.field]}
          />
      </View>
    )
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
        this._appendMessage('Success');
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

  _appendMessage(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({messages: this.state.messages.concat(string)});
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

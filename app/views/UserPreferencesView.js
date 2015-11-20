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
  ToastAndroid,
  ListView
  } = React;

var currentUser = require('../models/current-user');

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
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Set preferences</Text>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          <Text style={styles.label}>Notify me:</Text>
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
      <View style={styles.row}>
        <View style={styles.rightContainer}>
          <SwitchComponent
            style={styles.switch}
            onValueChange={this._changePreferences.bind(this, item.field)}
            value={this.state[item.field]}
            />
        </View>
        <Text>{item.description}</Text>
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

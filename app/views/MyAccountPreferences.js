var _ = require('underscore');
var React = require('react-native');
var Platform = require('Platform');
var LoadingView = require('../components/Loading');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var alert = require('../libs/alert');
var s = require('../styles/style');

var {
  Component,
  Text,
  View
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'set-preferences': 'Set preferences',
  'notify-me': 'NOTIFY ME',
  'on-email': 'on email (only if you are offline)',
  'on-mobile': 'on mobile',
  'private': 'when a user sends me a private message',
  'invite': 'when a user invites me'
});

class UserPreferencesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      preferences: {
        'notif:channels:email': false,
        'notif:channels:mobile': false,
        'notif:usermessage': false,
        'notif:invite': false
      }
    };
  }

  componentDidMount() {
    app.client.userPreferencesRead(null, (data) => {
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

    return (
      <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1, backgroundColor: '#f0f0f0' }}>
        <Text style={[s.h1, s.textCenter, s.marginTop5]}>{i18next.t('local:set-preferences')}</Text>

        <Text style={[s.listGroupTitle, s.marginTop20]}>{i18next.t('local:notify-me')}</Text>
        <View style={s.listGroup}>

          <ListItem text={i18next.t('local:on-email')}
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:channels:email')}
                         switchValue={this.state.preferences['notif:channels:email']}
            />

          <ListItem text={i18next.t('local:on-mobile')}
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:channels:mobile')}
                         switchValue={this.state.preferences['notif:channels:mobile']}
            />

          <ListItem text={i18next.t('local:private')}
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:usermessage')}
                         switchValue={this.state.preferences['notif:usermessage']}
            />

          <ListItem text={i18next.t('local:invite')}
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
    app.client.userPreferencesUpdate(update, (response) => {
      if (response.err) {
        alert.show(response.err);
      }

      var preferences = _.clone(this.state.preferences);
      preferences[key] = newVal;
      this.setState({
        preferences
      });
    });
  }
}

module.exports = UserPreferencesView;

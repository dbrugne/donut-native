var _ = require('underscore');
var React = require('react-native');
var Platform = require('Platform');

var currentUser = require('../models/mobile-current-user');

var LoadingView = require('../components/Loading');
var ListGroupItem = require('../components/ListGroupItem');

var client = require('../libs/client');
var alert = require('../libs/alert');

var s = require('../styles/style');

var {
  Component,
  Text,
  View
  } = React;

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'set-preferences': 'Set preferences',
  'notify-me': 'NOTIFY ME',
  'on-email': 'on email (only if you are offline)',
  'on-mobile': 'on mobile',
  'private': 'when a user sends me a private message',
  'invite': 'when a user invites me',
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
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

    return (
      <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1, backgroundColor: '#f0f0f0' }}>
        <Text style={[s.h1, s.textCenter, s.marginTop5]}>{i18next.t('set-preferences')}</Text>

        <Text style={[s.listGroupTitle, s.marginTop20]}>{i18next.t('notify-me')}</Text>
        <View style={s.listGroup}>

          <ListGroupItem text={i18next.t('on email (only if you are offline)')}
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:channels:email')}
                         switchValue={this.state.preferences['notif:channels:email']}
            />

          <ListGroupItem text={i18next.t('on mobile')}
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:channels:mobile')}
                         switchValue={this.state.preferences['notif:channels:mobile']}
            />

          <ListGroupItem text={i18next.t('private')}
                         type='switch'
                         onSwitch={this._changePreferences.bind(this, 'notif:usermessage')}
                         switchValue={this.state.preferences['notif:usermessage']}
            />

          <ListGroupItem text={i18next.t('invite')}
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
        alert.show(response.err);
      } else {
        alert.show(i18next.t('global.success'));
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

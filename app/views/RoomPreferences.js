var _ = require('underscore');
var React = require('react-native');
var LoadingView = require('../components/Loading');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var alert = require('../libs/alert');
var s = require('../styles/style');

var {
  Component,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomPreferences', {
  'title': 'NOTIFY ME WHEN (only applies to this discussion)',
  'roomjoin': 'a user join this discussion',
  'roommessage': 'a user post a message in this discussion',
  'usermention': 'a user mentions me in this discussion',
  'roomtopic': 'a user changes the topic of this discussion',
  'roompromote': 'I am promoted, kicked or banned from this discussion'
});

class RoomPreferencesView extends Component {
  constructor (props) {
    super(props);
    this.id = props.model.get('id');
    this.keys = ['roomjoin', 'roommessage', 'usermention', 'roomtopic', 'roompromote'];

    var preferences = {};
    _.each(this.keys, (key) => {
      preferences['room:notif:__key__:__id__'.replace('__key__', key).replace('__id__', this.id)] = false;
    });

    this.state = {
      loaded: false,
      preferences
    };
  }

  componentDidMount () {
    var that = this;
    app.client.userPreferencesRead(this.id, (data) => {
      if (!data.preferences) {
        return;
      }

      var preferences = _.clone(that.state.preferences);

      _.each(preferences, (val, key) => {
        if (_.has(data.preferences, key)) {
          preferences[key] = data.preferences[key];
        }
      });

      that.setState({
        loaded: true,
        preferences
      });
    });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1}}>
        <View style={[s.listGroup, {marginTop: 20}]}>
          {_.map(this.keys, (key, index) => {
            return (
              <ListItem text={i18next.t('RoomPreferences:__key__'.replace('__key__', key))}
                        key={key}
                        type='switch'
                        title={index === 0 ? i18next.t('RoomPreferences:title') : ''}
                        first={index === 0}
                        last={index === this.keys.length}
                        onSwitch={this._changePreferences.bind(this, 'room:notif:__key__:__id__'.replace('__key__', key).replace('__id__', this.id))}
                        switchValue={this.state.preferences['room:notif:__key__:__id__'.replace('__key__', key).replace('__id__', this.id)]}
                />
            );
          })}
        </View>
      </View>
    );
  }

  _changePreferences (key) {
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

module.exports = RoomPreferencesView;

RoomPreferencesView.propTypes = {
  model: React.PropTypes.object
};

'use strict';

var React = require('react-native');
var Platform = require('Platform');
var _ = require('underscore');

var client = require('../libs/client');
var app = require('../libs/app');
var alert = require('../libs/alert');

var s = require('../styles/style');

var {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  SwitchAndroid,
  SwitchIOS,
  View,
  Component
  } = React;


var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'name': 'name of donut',
  'help ': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)',
  'disclaimer': 'You are about to create a donut in the global space, if you want to create a donut in a community you are a member of, go to the community page and click on "Create a donut"',
  'who': 'Who can join the donut',
  'public': 'Public (default)',
  'any': 'Any user can join, participate and access history. Moderation tools available.',
  'private': 'Private',
  'only': 'Only users you authorize can join, participate and access history. Moderation tools available.',
  'create': 'Créer',
  'joining': 'joining ...'
};
i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});


class RoomCreateView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      public: true,
      private: false
    }
  }

  render() {
    var SwitchComponent;
    if (Platform.OS === 'android') {
      SwitchComponent = SwitchAndroid;
    } else {
      SwitchComponent = SwitchIOS;
    }

    return (
      <View style={styles.container}>

        <View style={s.inputContainer}>
          <TextInput style={s.input}
                     autoFocus={true}
                     placeholder={i18next.t('name')}
                     onChangeText={(text) => this.setState({roomName: text})}
                     value={this.state.roomName}
            />
        </View>

        <View style={{marginHorizontal: 10}}>

          <Text style={styles.help}>
            {i18next.t('help')}
          </Text>

          <Text style={styles.infoRoomName}>
            {i18next.t('disclaimer')}
          </Text>

          <Text style={[s.h1, s.marginTop10]}>
            {i18next.t('who')}
          </Text>

          <View style={[styles.modes, s.marginTop10]}>
            <View style={styles.modeOption}>
              <SwitchComponent
                onValueChange={this.onChangeMode.bind(this)}
                value={this.state.public}
                disabled={this.state.public}
                />
              <Text style={{marginLeft:10}}>{i18next.t('public')}</Text>
            </View>
            <Text style={styles.help}>{i18next.t('any')}</Text>
          </View>
          <View style={styles.modes}>
            <View style={styles.modeOption}>
              <SwitchComponent
                onValueChange={this.onChangeMode.bind(this)}
                value={this.state.private}
                disabled={this.state.private}
                />
              <Text style={{marginLeft:10}}>{i18next.t('private')}</Text>
            </View>
            <Text style={styles.help}>{i18next.t('only')}</Text>
          </View>
        </View>

        <TouchableHighlight style={[s.button, s.buttonGreen, s.marginTop10]}
                            underlayColor='#50EEC1'
                            onPress={(this.onRoomCreate.bind(this))}>
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>{i18next.t('create')}</Text>
          </View>
        </TouchableHighlight>

      </View>
    );
  }

  onChangeMode() {
    this.setState({
      public: !this.state.public,
      private: !this.state.private
    });
  }

  onRoomCreate() {
    if (!this.state.roomName) {
      return alert.show(i18next.t('global.not-complete'));
    }

    var mode = (this.state.public) ? 'public' : 'private';
    client.roomCreate(this.state.roomName, mode, null, null, (response) => {
      if (response.err) {
        alert.show(response.err);
      } else {
        alert.show(i18next.t('joining'));
        client.roomId('#' + this.state.roomName, (data) => {
          if (data.err) {
            alert.show(response.err);
          } else {
            app.trigger('joinRoom', data.room_id);
          }
        });
      }
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  inputRoomName: {
    height: 40,
    borderWidth: 1,
    margin: 10
  },
  help: {
    fontStyle: 'italic',
    color: '#737373',
    marginVertical: 10
  },
  infoRoomName: {
    color: '#000'
  },
  title: {
    color: '#6f6f6f',
    fontWeight: 'bold',
    margin: 10
  },
  modes: {
    flexDirection: 'column',
    marginBottom: 10
  },
  modeOption: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center'
  },
  button: {
    height: 25,
    width: 100,
    backgroundColor: "#16a085",
    borderRadius: 3,
    justifyContent: "center",
    alignSelf: "center"
  }
});

module.exports = RoomCreateView;
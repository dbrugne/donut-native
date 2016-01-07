'use strict';

var React = require('react-native');
var Platform = require('Platform');
var _ = require('underscore');
var app = require('../libs/app');
var alert = require('../libs/alert');
var navigation = require('../libs/navigation');
var Link = require('../elements/Link');
var s = require('../styles/style');
var Button = require('../elements/Button');

var {
  StyleSheet,
  Text,
  TextInput,
  SwitchAndroid,
  SwitchIOS,
  ScrollView,
  View,
  Component
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'name': 'name of donut',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)',
  'disclaimer': 'You are about to create a donut in the global space, if you want to create a donut in a community you are a member of, go to the community page and click on "Create a donut"',
  'who': 'Who can join the donut',
  'public': 'Public',
  'any': 'Any user can join, participate and access history. Moderation tools available.',
  'private': 'Private',
  'only': 'Only users you authorize can join, participate and access history. Moderation tools available.',
  'create': 'create',
  'joining': 'joining ...',
  'community': 'Already lead a community ? Want your users to feel home ?',
  'create-community': 'Create a DONUT community'
});

class RoomCreateView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      public: true
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
      <ScrollView style={styles.container}>

        <View style={[s.inputContainer, {marginHorizontal: 10}]}>
          <TextInput style={s.input}
                     autoCapitalize='none'
                     placeholder={i18next.t('local:name')}
                     onChangeText={(text) => this.setState({roomName: text})}
                     value={this.state.roomName}
            />
        </View>

        <View style={{marginHorizontal: 10}}>

          <Text style={styles.help}>
            {i18next.t('local:help')}
          </Text>

          <Text style={[styles.infoRoomName, s.marginTop10]}>
            {i18next.t('local:disclaimer')}
          </Text>

          <Text style={[s.h2, s.marginTop10]}>
            {i18next.t('local:who')}
          </Text>

          <View style={[styles.modes, s.marginTop10]}>
            <View style={styles.modeOption}>
              <Text style={{flex:1}}>{ this.state.public ? i18next.t('local:public') : i18next.t('local:private')}</Text>
              <SwitchComponent
                style={{alignSelf:'flex-end'}}
                onValueChange={(value) => this.setState({public: value})}
                value={this.state.public}
                />
            </View>
            <Text style={styles.help}>{ this.state.public ? i18next.t('local:any') : i18next.t('local:only')}</Text>
          </View>

        </View>

        <Button onPress={(this.onRoomCreate.bind(this))}
                style={[s.marginTop10, {marginHorizontal: 10}]}
                type='green'
                label={i18next.t('local:create')} />

        <View style={[s.marginTop10, {marginHorizontal: 10}]}>
          <Text>{i18next.t('local:community')}</Text>
          <Link onPress={() => navigation.switchTo(navigation.getGroupCreate())}
                text={i18next.t('local:create-community')}
                style={s.marginTop10}
                type='underlined'
                linkStyle={{textAlign: 'center'}}
            />
        </View>

      </ScrollView>
    );
  }

  onRoomCreate() {
    if (!this.state.roomName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    var mode = (this.state.public) ? 'public' : 'private';
    app.client.roomCreate(this.state.roomName, mode, null, null, (response) => {
      if (response.err) {
        alert.show(response.err);
      } else {
        alert.show(i18next.t('local:joining'));
        app.client.roomId('#' + this.state.roomName, (data) => {
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
    flex: 1,
    marginTop:10
  },
  help: {
    fontSize:10,
    color: '#737373',
    marginVertical: 5
  },
  infoRoomName: {
    color: '#000'
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
'use strict';

var React = require('react-native');
var app = require('../libs/app');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');

var {
  StyleSheet,
  Text,
  ScrollView,
  Component,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'name': 'name of donut',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)',
  'disclaimer': 'You are about to create a donut in the global space, if you want to create a donut in a community you are a member of, go to the community page and click on "Create a donut"',
  'disclaimer2': 'You are on the donut creation page. Start by entering a name',
  'who': 'Who can join the donut',
  'public': 'Public',
  'any': 'Any user can join, participate and access history. Moderation tools available.',
  'private': 'Private',
  'only': 'Only users you authorize can join, participate and access history. Moderation tools available.',
  'create': 'create a donut',
  'joining': 'joining ...',
  'community': 'Already lead a community ? Want your users to feel home ?',
  'create-community': 'create a community'
});

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      roomName: '',
      public: true
    };
  }

  render () {
    return (
      <ScrollView style={styles.container}>

        <Text style={[styles.block]}>{i18next.t('local:disclaimer2')}</Text>

        <ListItem
          type='input'
          first
          last
          autoCapitalize='none'
          placeholder={i18next.t('local:name')}
          onChangeText={(text) => this.setState({roomName: text})}
          value={this.state.roomName}
          help={i18next.t('local:help')}
          />

        <Text style={[styles.block]}>{i18next.t('local:disclaimer')}</Text>

        <ListItem
          type='switch'
          first
          last
          title={i18next.t('local:who')}
          text={ this.state.public ? i18next.t('local:public') : i18next.t('local:private')}
          onSwitch={this._changeMode.bind(this)}
          switchValue={this.state.public}
          help={ this.state.public ? i18next.t('local:any') : i18next.t('local:only')}
          />

        <Text style={styles.listGroupItemSpacing}/>
        <ListItem
          type='button'
          first
          last
          action
          onPress={(this.onRoomCreate.bind(this))}
          text={i18next.t('local:create')}
          />

        <Text style={styles.listGroupItemSpacing}/>
        <Text style={[styles.block]}>{i18next.t('local:community')}</Text>
        <ListItem
          type='button'
          first
          last
          action
          onPress={() => navigation.navigate('CreateGroup')}
          text={i18next.t('local:create-community')}
          />

        <Text style={[styles.block]}/>

      </ScrollView>
    );
  }

  _changeMode () {
    this.setState({
      public: !this.state.public
    });
  }

  onRoomCreate () {
    if (!this.state.roomName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    var mode = (this.state.public) ? 'public' : 'private';
    app.client.roomCreate(this.state.roomName, mode, null, null, (response) => {
      if (response.err) {
        alert.show(i18next.t('messages.' + response.err));
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
    backgroundColor: '#f0f0f0'
  },
  block: {
    color: '#333',
    marginVertical: 20,
    marginHorizontal: 10
  }
});

module.exports = RoomCreateView;

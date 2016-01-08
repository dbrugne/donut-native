'use strict';

var React = require('react-native');
var app = require('../libs/app');
var alert = require('../libs/alert');
var ListItem = require('../elements/ListItem');
var ConnectionState = require('../components/ConnectionState');

var {
  StyleSheet,
  Text,
  ScrollView,
  Component,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'name': 'name of community',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_). Caution the community name cannot be changed',
  'disclaimer2': 'You are on the community creation page. Start by entering a name',
  'disclaimer': 'A community is a place where your members can gather and create donuts to chat with each other and external users if they want.',
  'create': 'create'
});

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      groupName: ''
    };
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <ConnectionState/>
        <ScrollView style={styles.container}>

          <Text style={styles.block}>{i18next.t('local:disclaimer2')}</Text>

          <ListItem
            type='input'
            first
            last
            autoCapitalize='none'
            placeholder={i18next.t('local:name')}
            onChangeText={(text) => this.setState({groupName: text})}
            value={this.state.groupName}
            help={i18next.t('local:help')}
            />

          <Text style={[styles.block]}>{i18next.t('local:disclaimer')}</Text>

          <ListItem
            type='button'
            first
            last
            action
            onPress={(this.onGroupCreate.bind(this))}
            text={i18next.t('local:create')}
            />

        </ScrollView>
      </View>
    );
  }

  onGroupCreate () {
    if (!this.state.groupName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    app.client.groupCreate(this.state.groupName, (response) => {
      if (!response.success) {
        if (response.err === 'group-name-already-exist') {
          return alert.show(i18next.t('messages.group-name-already-exist', {name: this.state.groupName}));
        }
        if (response.err === 'not-confirmed') {
          return alert.show(i18next.t('messages.not-confirmed'));
        }
        return alert.show(i18next.t('messages.unknownerror'));
      }

      alert.show(i18next.t('local:joining'));
      app.client.groupId('#' + this.state.groupName, (data) => {
        if (data.err) {
          alert.show(i18next.t('messages.' + response.err));
        } else {
          // @todo spariaud finish joinGroup implementation
          app.trigger('joinGroup', data.group_id);
        }
      });
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

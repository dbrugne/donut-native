'use strict';

var React = require('react-native');
var Platform = require('Platform');
var _ = require('underscore');
var client = require('../libs/client');
var app = require('../libs/app');
var alert = require('../libs/alert');
var Button = require('../elements/Button');
var s = require('../styles/style');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Component
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'name': 'name of community',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_). Caution the community name cannot be changed',
  'disclaimer': 'A community is a place where your members can gather and create donuts to chat with each other and external users if they want.',
  'create': 'create'  
});

class RoomCreateView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={[s.inputContainer, {marginHorizontal: 10}]}>
          <TextInput style={s.input}
                     autoFocus={true}
                     placeholder={i18next.t('local:name')}
                     onChangeText={(text) => this.setState({groupName: text})}
                     value={this.state.groupName}
            />
        </View>

        <View style={{marginHorizontal: 10}}>

          <Text style={styles.help}>
            {i18next.t('local:help')}
          </Text>

          <Text style={styles.infoRoomName}>
            {i18next.t('local:disclaimer')}
          </Text>

        </View>

        <Button onPress={(this.onGroupCreate.bind(this))}
                style={[s.marginTop10, {marginHorizontal: 10}]}
                type='green'
                label={i18next.t('local:create')} />

      </View>
    );
  }

  onGroupCreate() {
    if (!this.state.groupName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    client.groupCreate(this.state.groupName, (response) => {
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
      client.groupId('#' + this.state.groupName, (data) => {
        if (data.err) {
          alert.show(response.err);
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
    flex: 1
  },
  help: {
    fontStyle: 'italic',
    color: '#737373',
    marginVertical: 10
  },
  infoRoomName: {
    color: '#000'
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
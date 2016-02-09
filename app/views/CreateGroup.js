'use strict';

var _ = require('underscore');
var React = require('react-native');
var app = require('../libs/app');
var alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var LoadingModal = require('../components/LoadingModal');
var navigation = require('../navigation/index');

var {
  StyleSheet,
  Text,
  ScrollView,
  Component,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'createGroup', {
  'name': 'Enter a community name',
  'help': 'Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_). Caution the community name cannot be changed',
  'create': 'create'
});

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      groupName: '',
      showLoading: false
    };
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>

          <Text style={styles.listGroupItemSpacing}/>
          <ListItem
            type='input'
            first
            last
            autoCapitalize='none'
            placeholder={i18next.t('createGroup:name')}
            onChangeText={(text) => this.setState({groupName: text})}
            value={this.state.groupName}
            help={i18next.t('createGroup:help')}
            />

          <Text style={styles.listGroupItemSpacing}/>
          <ListItem
            type='button'
            first
            last
            action
            onPress={(this.onGroupCreate.bind(this))}
            text={i18next.t('createGroup:create')}
            />

        </ScrollView>
        {this.state.showLoading ? <LoadingModal/> : null}
      </View>
    );
  }

  onGroupCreate () {
    if (!this.state.groupName) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    this.setState({showLoading: true});
    app.client.groupCreate(this.state.groupName, _.bind(function (response) {
      if (!response.success) {
        this.setState({showLoading: false});
        if (response.err === 'room-already-exist' || response.err === 'group-name-already-exist') {
          return alert.show(i18next.t('messages.' + response.err, {name: this.state.groupName}));
        } else if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
      }

      app.client.groupId(this.state.groupName, _.bind(function (data) {
        this.setState({showLoading: false, groupName: ''});
        if (data.err) {
          return alert.show(i18next.t('messages.' + data.err));
        }
        app.trigger('joinGroup', data.group_id);
      }, this));
    }, this));
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

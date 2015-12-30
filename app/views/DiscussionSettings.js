'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var s = require('../styles/style');
var ListItem = require('../elements/ListItem');
var navigation = require('../libs/navigation');

var {
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'settings': '__identifier__ SETTINGS',
  'see': 'See the profile',
  'block': 'Block this user',
  'unblock': 'Unbock this user',
  'edit': 'Edit',
  'access': 'Access',
  'allowed': 'Allowed users',
  'leave': 'Leave this donut',
  'close': 'Close this private discussion',
  'users': 'Users list'
}, true, true);

class DiscussionSettings extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    // @todo link to room edit page
    // @todo link to room access page
    // @todo link to room allowed users page

    return (
      <ScrollView style={styles.main}>
        {this._renderLinks()}
      </ScrollView>
    );
  }

  _renderLinks() {
    if (this.props.model.get('type') === 'user') {
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => {this.props.navigator.push(navigation.getProfile({type: 'user', id: this.props.model.get('id'), identidier: '@' + this.props.model.get('username')}));}}
            title={i18next.t('local:settings', {identifier: this.props.model.get('identifier')})}
            text={i18next.t('local:see')}
            icon='fontawesome|eye'
            type='button'
            first={true}
            action={true}
            />
          <ListItem
            onPress={() => {this.props.navigator.push(navigation.getRoomUsers(this.props.model.get('id'), this.props.model));}}
            text={i18next.t('local:users')}
            icon='fontawesome|users'
            type='button'
            action={true}
            />
          {this._renderBlock()}
          <Text style={s.listGroupItemSpacing}></Text>
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('local:close')}
            type='button'
            first={true}
            warning={true}
            />
        </View>
      );
    } else {
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => {this.props.navigator.push(navigation.getProfile({type: 'room', id: this.props.model.get('id'), identifier: this.props.model.get('identifier')}));}}
            title={i18next.t('local:settings', {identifier: this.props.model.get('identifier')})}
            text={i18next.t('local:see')}
            icon='fontawesome|eye'
            type='button'
            first={true}
            action={true}
            />
          <ListItem
            onPress={() => {this.props.navigator.push(navigation.getRoomUsers(this.props.model.get('id'), this.props.model));}}
            text={i18next.t('local:users')}
            icon='fontawesome|users'
            type='button'
            action={true}
            />
          <ListItem
            onPress={() => console.log('@todo implement edit page')}
            text={i18next.t('local:edit')+' TODO'}
            icon='fontawesome|pencil'
            type='button'
            action={true}
            />
          <ListItem
            onPress={() => console.log('@todo implement edit page')}
            text={i18next.t('local:access')+' TODO'}
            icon='fontawesome|key'
            type='button'
            action={true}
            />
          {this._renderAllowedUsers()}
          <Text style={s.listGroupItemSpacing}></Text>
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('local:leave')}
            type='button'
            first={true}
            warning={true}
            />
        </View>
      );
    }
  }

  _renderBlock() {
    // @todo implement user block action
    // @todo implement user block action
    if (this.props.model.get('is_banned') === 'true') {
      return (
        <ListItem
          onPress={() => console.log('@todo implement user block action')}
          text={i18next.t('local:block')+' TODO'}
          icon='fontawesome|ban'
          iconColor='#e74c3c'
          type='button'
          action={true}
          warning={true}
          />
      );
    } else {
      return (
        <ListItem
          onPress={() => console.log('@todo implement user deblock action')}
          text={i18next.t('local:unblock')+' TODO'}
          icon='fontawesome|ban'
          type='button'
          action={true}
          />
      );
    }
  }

  _renderAllowedUsers() {
    if (this.props.model.get('mode') !== 'public') {
      return null;
    }

    return (
      // @todo open allowed users page
      <ListItem
        onPress={() => console.log('@todo implement allowed users page')}
        text={i18next.t('local:allowed')+' TODO'}
        icon='fontawesome|shield'
        type='button'
        action={true}
        />
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 20
  }
});

module.exports = DiscussionSettings;

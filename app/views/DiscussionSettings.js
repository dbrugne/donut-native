'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var s = require('../styles/style');
var ListItem = require('../components/ListItem');
var navigation = require('../navigation/index');
var common = require('@dbrugne/donut-common/mobile');

var {
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'settings': '__identifier__ SETTINGS',
  'change-topic': 'Change topic',
  'no-topic': 'No topic',
  'see': 'See profile',
  'block': 'Block this user',
  'unblock': 'Unblock this user',
  'edit': 'Edit',
  'access': 'Access',
  'allowed': 'Allowed users',
  'leave': 'Leave this donut',
  'close': 'Close this discussion',
  'users': 'Users list'
}, true, true);

class DiscussionSettings extends Component {
  constructor (props) {
    super(props);
    this.isOwner = (currentUser.get('user_id') === props.model.get('owner_id'));
    this.isAdmin = app.user.isAdmin();
    this.isOp = (_.indexOf(props.model.get('op'),currentUser.get('user_id')) !== -1);
  }
  render () {
    // @todo link to room edit page
    // @todo link to room access page
    // @todo link to room allowed users page

    return (
      <ScrollView style={styles.main}>
        <View style={styles.containerTop}>
          {this._renderAvatar(this.props.model.get('avatar'))}
          <Text style={{marginTop: 10}}>{this.props.model.get('identifier')}</Text>
        </View>
        {this._renderTopic()}
        {this._renderLinks()}
      </ScrollView>
    );
  }

  _renderLinks() {
    if (this.props.model.get('type') === 'onetoone') {
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('id'), identifier: this.props.model.get('identifier')})}
            text={i18next.t('local:see')}
            icon='fontawesome|eye'
            type='button'
            first
            action
            />
          {this._renderBlock()}
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('local:close')}
            type='button'
            first
            warning
            />
        </View>
      );
    } else {
      let itemTopic = null;
      if (this.isOp || this.isOwner || this.isAdmin) {
        itemTopic = (
          <ListItem
            style={{marginBottom: 20}}
            onPress={() => navigation.navigate('RoomTopic', this.props.model)}
            text={i18next.t('local:change-topic')}
            icon='fontawesome|edit'
            type='button'
            action
            first
            />
        );
      }
      return (
        <View style={s.listGroup}>
          {itemTopic}
          <ListItem
            onPress={() => navigation.navigate('Profile', {type: 'room', id: this.props.model.get('id'), identifier: this.props.model.get('identifier')})}
            text={i18next.t('local:see')}
            icon='fontawesome|eye'
            type='button'
            first
            action
            />
          <ListItem
            onPress={() => navigation.navigate('RoomUsers', this.props.model)}
            text={i18next.t('local:users')}
            icon='fontawesome|users'
            type='button'
            action
            />
          {this._renderAllowedUsers()}
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('local:leave')}
            type='button'
            first
            warning
            />
        </View>
      );
    }
  }

  _renderTopic () {
    if (this.props.model.get('type') === 'onetoone') {
      return null;
    }
    return (
      <View style={{marginHorizontal: 10, marginBottom:20 , alignSelf: 'center'}}>
        <Text style={s.topic}>{(this.props.model.get('topic')) ? this.props.model.get('topic') : i18next.t('local:no-topic')}</Text>
      </View>
    );
  }

  _renderBlock() {
    return null;
    // @todo implement user block action
    // @todo implement user block action
    //if (this.props.model.get('banned') === false) {
    //  return (
    //    <ListItem
    //      onPress={() => console.log('@todo implement user block action')}
    //      text={i18next.t('local:block')+' TODO'}
    //      icon='fontawesome|ban'
    //      iconColor='#e74c3c'
    //      type='button'
    //      action
    //      warning
    //      />
    //  );
    //} else {
    //  return (
    //    <ListItem
    //      onPress={() => console.log('@todo implement user deblock action')}
    //      text={i18next.t('local:unblock')+' TODO'}
    //      icon='fontawesome|ban'
    //      type='button'
    //      action
    //      />
    //  );
    //}
  }

  _renderAllowedUsers() {
    return null;
    //if (this.props.model.get('mode') !== 'public') {
    //  return null;
    //}
    //
    //return (
    //  // @todo open allowed users page
    //  <ListItem
    //    onPress={() => console.log('@todo implement allowed users page')}
    //    text={i18next.t('local:allowed')+' TODO'}
    //    icon='fontawesome|shield'
    //    type='button'
    //    action={true}
    //    />
    //);
  }

  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 60);
    if (!avatarUrl) {
      return null;
    }
    if (this.props.model.get('type') === 'room') {
      return (<Image style={styles.avatarRoom} source={{uri: avatarUrl}}/>);
    }
    return (
      <View style={styles.containerAvatarOne}>
        <Image style={styles.avatarOne} source={{uri: avatarUrl}} />
        <Text style={[styles.statusText, styles.status, this.props.model.get('status') === 'connecting' && styles.statusConnecting, this.props.model.get('status') === 'offline' && styles.statusOffline, this.props.model.get('status') === 'online' && styles.statusOnline]}>{this.props.model.get('status')}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 10
  },
  containerTop: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10
  },
  avatarRoom: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  containerAvatarOne: {
    flexDirection: 'column'
  },
  avatarOne: {
    width: 50,
    height: 50
  },
  status: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'center',
    flex:1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 50,
    paddingLeft:5,
    paddingRight:5,
    overflow: 'hidden'
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Open Sans'
  }
});

module.exports = DiscussionSettings;

'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var s = require('../styles/style');
var ListItem = require('../components/ListItem');
var navigation = require('../navigation/index');
var common = require('@dbrugne/donut-common/mobile');
var Alert = require('../libs/alert');
var imageUploader = require('../libs/imageUpload');
var emojione = require('emojione');

var {
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableHighlight
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscussionSettings', {
  'settings': '__identifier__ SETTINGS',
  'change-topic': 'Change topic',
  'no-topic': 'No topic',
  'see': 'See profile',
  'block': 'Block this user',
  'unblock': 'Unblock this user',
  'edit': 'Edit',
  'access': 'Access',
  'allowed': 'Manage invitations',
  'leave': 'Leave this donut',
  'close': 'Close this discussion',
  'users': 'Users list',
  'users-title': 'Users',
  'topic': 'Current topic',
  'description': 'Description',
  'avatar': 'Avatar',
  'website': 'Website',
  'end': 'End',
  'details': 'Profile details',
  'notifications': 'Custom notifications',
  'notifications-title': 'Notifications',
  'delete': 'Delete this discussion',
  'deleteTitle': 'Delete discussion',
  'deleteDisclaimer': 'Are you sure you whant to delete __identifier__. This action is ireversible'
}, true, true);

class DiscussionSettings extends Component {
  constructor (props) {
    super(props);
    this.isOwner = (currentUser.get('user_id') === props.model.get('owner_id'));
    this.isAdmin = app.user.isAdmin();
    this.isOp = (_.indexOf(props.model.get('op'), currentUser.get('user_id')) !== -1);
    this.state = {
      topic: this.props.model.get('topic'),
      avatar: this.props.model.get('avatar'),
      identifier: this.props.model.get('identifier'),
      status: this.props.model.get('status'),
      banned: this.props.model.get('banned')
    };
  }
  fetchData () {
    this.setState({
      topic: this.props.model.get('topic'),
      avatar: this.props.model.get('avatar'),
      identifier: this.props.model.get('identifier'),
      status: this.props.model.get('status'),
      banned: this.props.model.get('banned')
    });
  }
  render () {
    var setRoomNotificationLink = null;
    if (this.props.model.get('type') === 'room') {
      setRoomNotificationLink = (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('DiscussionSettings:notifications')}
            type='button'
            action
            title={i18next.t('DiscussionSettings:notifications-title')}
            first
            />
          </View>
      );
    }
    return (
      <ScrollView style={styles.main}>
        <View style={styles.containerTop}>
          {this._renderAvatar(this.state.avatar)}
          <Text style={{marginTop: 10}}>{this.state.identifier}</Text>
        </View>
        {this._renderTopic()}
        {this._renderLinks()}
        {this._renderEdition()}
        {setRoomNotificationLink}
        {this._renderEnd()}
      </ScrollView>
    );
  }

  _renderLinks () {
    if (this.props.model.get('type') === 'onetoone') {
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('id'), identifier: this.state.identifier})}
            text={i18next.t('DiscussionSettings:see')}
            icon='eye'
            type='button'
            first
            action
            />
          {this._renderBlock()}
        </View>
      );
    } else {
      let itemTopic = null;
      if (this.isOp || this.isOwner || this.isAdmin) {
        itemTopic = (
          <View>
            <ListItem
              onPress={() => navigation.navigate('AvailableSoon')}
              text={i18next.t('DiscussionSettings:access')}
              icon='users'
              type='button'
              action
              title={i18next.t('DiscussionSettings:users-title')}
              first
              />
            {this._renderAllowedUsers()}
          </View>
        );
      }
      return (
        <View style={s.listGroup}>
          {itemTopic}
          <ListItem
            onPress={() => navigation.navigate('RoomUsers', this.props.model.get('id'))}
            text={i18next.t('DiscussionSettings:users')}
            icon='users'
            type='button'
            action
            title={(!itemTopic) ? i18next.t('DiscussionSettings:users-title') : null}
            first={!(itemTopic)}
            />
        </View>
      );
    }
  }

  _renderTopic () {
    if (this.props.model.get('type') === 'onetoone') {
      return null;
    }

    var topic;
    if (this.state.topic) {
      topic = common.markup.toText(this.state.topic);
      topic = emojione.shortnameToUnicode(topic);
    }
    if (!topic) {
      topic = i18next.t('DiscussionSettings:no-topic');
    }

    if (!this.isOp && !this.isOwner && !this.isAdmin) {
      return (
        <View style={s.listGroup}>
          <Text style={s.topic}>{topic}</Text>
        </View>
      );
    } else {
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('RoomTopic', this.props.model, () => this.fetchData())}
            text={topic}
            type='button'
            action
            first
            title={i18next.t('DiscussionSettings:topic')}
            />
        </View>
      );
    }
  }

  _renderBlock () {
    if (this.state.banned === false) {
      return (
        <ListItem
          onPress={() => this._banUser()}
          text={i18next.t('DiscussionSettings:block')}
          icon='ban'
          iconColor='#e74c3c'
          type='button'
          action
          warning
          />
      );
    } else {
      return (
        <ListItem
          onPress={() => this._unbanUser()}
          text={i18next.t('DiscussionSettings:unblock')}
          icon='ban'
          type='button'
          action
          />
      );
    }
  }

  _banUser () {
    app.client.userBan(this.props.model.get('id'), (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: true});
    });
  }

  _unbanUser () {
    app.client.userDeban(this.props.model.get('id'), (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: false});
    });
  }

  _renderAllowedUsers () {
    return (
      <ListItem
          onPress={() => navigation.navigate('AvailableSoon')}
          text={i18next.t('DiscussionSettings:allowed')}
          icon='shield'
          type='button'
          action
        />
    );
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
      return (
        <TouchableHighlight
          onPress={() => navigation.navigate('Profile', {type: 'room', id: this.props.model.get('id'), identifier: this.props.model.get('identifier')})}
          >
          <Image style={styles.avatarRoom} source={{uri: avatarUrl}}/>
        </TouchableHighlight>
      );
    }
    return (
      <View style={styles.containerAvatarOne}>
        <Image style={styles.avatarOne} source={{uri: avatarUrl}} />
        <Text style={[styles.statusText, styles.status, this.state.status === 'connecting' && styles.statusConnecting, this.state.status === 'offline' && styles.statusOffline, this.state.status === 'online' && styles.statusOnline]}>{this.state.status}</Text>
      </View>
    );
  }

  _renderEdition () {
    if (this.props.model.get('type') === 'onetoone') {
      return null;
    }
    if (!this.isOp && !this.isOwner && !this.isAdmin) {
      return null;
    }
    return (
      <View style={s.listGroup}>
        <ListItem
          onPress={() => this._pickImage()}
          text={i18next.t('DiscussionSettings:avatar')}
          type='edit-button'
          action
          first
          title={i18next.t('DiscussionSettings:details')}
          />
        <ListItem
          onPress={() => navigation.navigate('RoomEditDescription', this.props.model.get('id'), (key, value) => this.saveRoomData(key, value))}
          text={i18next.t('DiscussionSettings:description')}
          type='edit-button'
          action
          />
        <ListItem
          onPress={() => navigation.navigate('RoomEditWebsite', this.props.model.get('id'), (key, value) => this.saveRoomData(key, value))}
          text={i18next.t('DiscussionSettings:website')}
          type='edit-button'
          action
          />
      </View>
    );
  }
  _pickImage () {
    imageUploader.getImageAndUpload('room,avatar', null, (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveRoomData('avatar', response, () => {});
    });
  }
  saveRoomData (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.roomUpdate(this.props.model.get('id'), updateData, (response) => {
      if (response.err) {
        for (var k in response.err) {
          if (response.err[k] === 'website-url') {
            Alert.show(i18next.t('RoomEdit:website-url'));
          } else {
            Alert.show('messages.unknown');
          }
        }
        return;
      }

      var object = {};
      object[key] = value;
      this.setState(object);
      if (callback) {
        callback();
      }
    });
  }
  _renderEnd () {
    if (this.props.model.get('type') === 'onetoone') {
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('DiscussionSettings:close')}
            type='button'
            first
            warning
            title={i18next.t('DiscussionSettings:end')}
            />
        </View>
      );
    } else {
      var deleteRoomLink = null;
      if (this.isOp || this.isOwner || this.isAdmin) {
        deleteRoomLink = (
          <ListItem
            onPress={() => this._deleteRoom()}
            text={i18next.t('DiscussionSettings:delete')}
            type='button'
            first
            warning
            />
        );
      }
      return (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('DiscussionSettings:leave')}
            type='button'
            first
            warning
            title={i18next.t('DiscussionSettings:end')}
            />
          {deleteRoomLink}
        </View>
      );
    }
  }
  _deleteRoom () {
    Alert.askConfirmation(
      i18next.t('DiscussionSettings:deleteTitle'),
      i18next.t('DiscussionSettings:deleteDisclaimer', {identifier: this.props.model.get('identifier')}),
      () => app.client.roomDelete(this.props.model.get('id'), () => {}),
      () => {}
    );
  }
}

DiscussionSettings.propTypes = {model: React.PropTypes.object};

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
    flex: 1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 50,
    paddingLeft: 5,
    paddingRight: 5,
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

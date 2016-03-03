'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var s = require('../styles/style');
var Button = require('../components/Button');
var ListItem = require('../components/ListItem');
var navigation = require('../navigation/index');
var common = require('@dbrugne/donut-common/mobile');
var Alert = require('../libs/alert');
var imageUploader = require('../libs/imageUpload');
var emojione = require('emojione');
var DiscussionHeader = require('./DiscussionHeader');

var {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableHighlight
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscussionSettings', {
  'topic': 'CURRENT TOPIC',
  'users-title': 'USERS',
  'users': 'USERS LIST',
  'details': 'PROFILE DETAILS',
  'notifications-title': 'NOTIFICATIONS',
  'notifications': 'Custom notifications',
  'silence': 'Silence',
  'access': 'Access',
  'no-topic': 'No topic',
  'block': 'Block this user',
  'unblock': 'Unblock this user',
  'allowed': 'Manage invitations',
  'avatar': 'Profile picture',
  'description': 'Description',
  'website': 'Website',
  'delete': 'DELETE THIS DISCUSSION',
  'leave': 'LEAVE THIS DISCUSSION',
  'deleteTitle': 'delete discussion',
  'deleteDisclaimer': 'Are you sure you want to delete this discussion ? This action is irreversible.'
});

var DiscussionSettings = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    this.isOwner = (currentUser.get('user_id') === this.props.model.get('owner_id'));
    this.isAdmin = app.user.isAdmin();
    this.isOp = (_.indexOf(this.props.model.get('op'), currentUser.get('user_id')) !== -1);
    this.can_delete = true;
    return {
      topic: this.props.model.get('topic'),
      avatar: this.props.model.get('avatar'),
      identifier: this.props.model.get('identifier'),
      status: this.props.model.get('status'),
      banned: this.props.model.get('banned'),
      userListLoaded: false,
      nbUsers: '...',
      description: '',
      website: ''
    };
  },
  fetchData: function () {
    this.setState({
      topic: this.props.model.get('topic'),
      avatar: this.props.model.get('avatar'),
      identifier: this.props.model.get('identifier'),
      status: this.props.model.get('status'),
      banned: this.props.model.get('banned')
    });
  },
  componentDidMount: function () {
    if (this.props.model.get('type') === 'room') {
      app.client.roomUsers(this.props.model.get('id'), {type: 'users', selector: {start: 0, length: 15}}, (data) => {
        if (data.err || data === 'not-connected') {
          return;
        }
        this.setState({nbUsers: data.count.toString(), users: data.users, userListLoaded: true});
      });
      app.client.roomRead(this.props.model.get('id'), {more: true}, (data) => {
        if (data.err || data === 'not-connected') {
          return;
        }
        var website = '';
        if (data.website && data.website.title) {
          website = data.website.title;
        }
        this.can_delete = data.can_delete;
        this.setState({description: data.description, website: website});
      });
    }
    this.props.model.on('change:avatar', () => this.setState({avatar: this.props.model.get('avatar')}), this);
  },
  componentWillUnmount: function () {
    this.props.model.off(this, null, null);
  },
  render: function () {
    var setRoomNotificationLink = null;
    if (this.props.model.get('type') === 'room') {
      setRoomNotificationLink = (
        <View style={s.listGroup}>
          <ListItem type='button'
                    onPress={() => navigation.navigate('AvailableSoon')}
                    text={i18next.t('DiscussionSettings:notifications')}
                    action
                    title={i18next.t('DiscussionSettings:notifications-title')}
                    first
            />
          <ListItem type='switch'
                    text={i18next.t('DiscussionSettings:silence')}
                    switchValue={false}
                    onSwitch={() => navigation.navigate('AvailableSoon')}
            />
        </View>
      );
    }
    return (
      <ScrollView style={styles.main}>
        <DiscussionHeader model={this.props.model} small/>
        <View style={{ marginTop: 20 }}/>
        {this._renderTopic()}
        {this._renderUsers()}
        {this._renderUsersList()}
        {this._renderEdition()}
        {setRoomNotificationLink}
        {this._renderEnd()}
      </ScrollView>
    );
  },
  _renderUsers: function () {
    if (!this.isOp && !this.isOwner && !this.isAdmin) {
      return null;
    }

    return (
      <View>
        <ListItem
          onPress={() => navigation.navigate('RoomAccess', this.props.model)}
          text={i18next.t('DiscussionSettings:access')}
          type='button'
          action
          title={i18next.t('DiscussionSettings:users-title')}
          first
          />
        <ListItem
          onPress={() => navigation.navigate('ManageInvitations', {id: this.props.model.get('id'), type: 'room'})}
          text={i18next.t('DiscussionSettings:allowed')}
          type='button'
          action
          last
          />
      </View>
    );
  },
  _renderUsersList: function () {
    return (
      <View style={{ marginTop: 20 }}>
        <ListItem type='image-list'
                  onPress={() => navigation.navigate('RoomUsers', this.props.model.get('id'))}
                  text={i18next.t('DiscussionSettings:users')}
                  action
                  model={this.props.model}
                  parentType='room'
                  isOwnerAdminOrOp={this.isOp || this.isOwner || this.isAdmin}
                  value={this.state.nbUsers}
                  first
                  last
                  imageList={this.state.userListLoaded ? this.state.users : null}
          />
      </View>
    );
  },
  _renderTopic: function () {
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
          <ListItem type='text'
                    text={topic}
                    first
                    last
                    title={i18next.t('DiscussionSettings:topic')}
            />
        </View>
      );
    } else {
      return (
        <View style={s.listGroup}>
          <ListItem type='button'
                    onPress={() => navigation.navigate('RoomTopic', this.props.model, () => this.fetchData())}
                    text={topic}
                    action
                    first
                    last
                    title={i18next.t('DiscussionSettings:topic')}
            />
        </View>
      );
    }
  },
  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 50);
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
        <Image style={styles.avatarOne} source={{uri: avatarUrl}}/>
        <Text
          style={[styles.statusText, styles.status, this.state.status === 'connecting' && styles.statusConnecting, this.state.status === 'offline' && styles.statusOffline, this.state.status === 'online' && styles.statusOnline]}>{this.state.status}</Text>
      </View>
    );
  },
  _renderEdition: function () {
    if (!this.isOwner && !this.isAdmin) {
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
          onPress={() => navigation.navigate('RoomEditDescription', this.props.model.get('id'), (key, value, cb) => this.saveRoomData(key, value, cb))}
          text={i18next.t('DiscussionSettings:description')}
          type='edit-button'
          action
          value={_.unescape(this.state.description)}
          />
        <ListItem
          onPress={() => navigation.navigate('RoomEditWebsite', this.props.model.get('id'), (key, value, cb) => this.saveRoomData(key, value, cb))}
          text={i18next.t('DiscussionSettings:website')}
          type='edit-button'
          action
          value={this.state.website}
          />
      </View>
    );
  },
  _pickImage: function () {
    imageUploader.getImageAndUpload('room,avatar', null, (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveRoomData('avatar', response);
    });
  },
  saveRoomData (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.roomUpdate(this.props.model.get('id'), updateData, (response) => {
      if (response.err) {
        for (var k in response.err) {
          Alert.show(i18next.t('messages.' + response.err[k]));
        }
        if (callback) {
          return callback(response.err);
        }
        return;
      }

      if (key !== 'avatar') {
        var object = {};
        object[key] = value;
        this.setState(object);
      }
      if (callback) {
        callback();
      }
    });
  },
  _renderEnd: function () {
    var deleteRoomLink = null;
    if ((this.isOwner || this.isAdmin) && this.can_delete) {
      deleteRoomLink = (
        <Button
          onPress={() => this._deleteRoom()}
          label={i18next.t('DiscussionSettings:delete')}
          type='red'
          style={{ marginHorizontal: 20, marginTop: 10 }}
          />
      );
      return (
        <View>
          <Button
            onPress={() => this.props.model.leave()}
            label={i18next.t('DiscussionSettings:leave')}
            type='gray'
            style={{ marginHorizontal: 20, marginTop: 20 }}
            />
          {deleteRoomLink}
        </View>
      );
    }
  },
  _deleteRoom: function () {
    Alert.askConfirmation(
      i18next.t('DiscussionSettings:deleteTitle'),
      i18next.t('DiscussionSettings:deleteDisclaimer', {identifier: this.props.model.get('identifier')}),
      () => app.client.roomDelete(this.props.model.get('id'), () => {
      }),
      () => {
      }
    );
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 20
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
  statusOnline: {backgroundColor: 'rgba(79, 237, 192, 0.8)'},
  statusConnecting: {backgroundColor: 'rgba(255, 218, 62, 0.8)'},
  statusOffline: {backgroundColor: 'rgba(119,119,119,0.8)'},
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Open Sans'
  }
});

module.exports = DiscussionSettings;

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
i18next.addResourceBundle('en', 'DiscussionSettings', {
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
      status: this.props.model.get('status')
    });
  }
  render () {
    return (
      <ScrollView style={styles.main}>
        <View style={styles.containerTop}>
          {this._renderAvatar(this.state.avatar)}
          <Text style={{marginTop: 10}}>{this.state.identifier}</Text>
        </View>
        {this._renderTopic()}
        {this._renderLinks()}
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
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('DiscussionSettings:close')}
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
          <View style={{marginBottom: 20}}>
            <ListItem
              onPress={() => navigation.navigate('RoomTopic', this.props.model, () => this.fetchData())}
              text={i18next.t('DiscussionSettings:change-topic')}
              icon='edit'
              type='button'
              action
              first
              />
            <ListItem
              text={i18next.t('DiscussionSettings:edit')}
              type='edit-button'
              action
              onPress={() => navigation.navigate('RoomEdit', this.props.model.attributes)}
              icon='pencil'
              />
            <ListItem
              onPress={() => navigation.navigate('AvailableSoon')}
              text={i18next.t('DiscussionSettings:access')}
              icon='users'
              type='button'
              action
              />
            {this._renderAllowedUsers()}
          </View>
        );
      }
      return (
        <View style={s.listGroup}>
          {itemTopic}
          <ListItem
            onPress={() => navigation.navigate('Profile', {type: 'room', id: this.props.model.get('id'), identifier: this.state.identifier})}
            text={i18next.t('DiscussionSettings:see')}
            icon='eye'
            type='button'
            first
            action
            />
          <ListItem
            onPress={() => navigation.navigate('RoomUsers', this.props.model.get('id'))}
            text={i18next.t('DiscussionSettings:users')}
            icon='users'
            type='button'
            action
            />
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={() => this.props.model.leave()}
            text={i18next.t('DiscussionSettings:leave')}
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
      <View style={{marginHorizontal: 10, marginBottom: 20, alignSelf: 'center'}}>
        <Text style={s.topic}>{(this.state.topic) ? common.markup.toText(this.state.topic) : i18next.t('DiscussionSettings:no-topic')}</Text>
      </View>
    );
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
      return (<Image style={styles.avatarRoom} source={{uri: avatarUrl}}/>);
    }
    return (
      <View style={styles.containerAvatarOne}>
        <Image style={styles.avatarOne} source={{uri: avatarUrl}} />
        <Text style={[styles.statusText, styles.status, this.state.status === 'connecting' && styles.statusConnecting, this.state.status === 'offline' && styles.statusOffline, this.state.status === 'online' && styles.statusOnline]}>{this.state.status}</Text>
      </View>
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

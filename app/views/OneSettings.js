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
  Image,
  TouchableHighlight
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'OneSettings', {
  'close': 'Close this discussion',
  'end': 'End',
  'notifications': 'Custom notifications',
  'notifications-title': 'Notifications',
  'silence': 'Silence',
  'see': 'See profile',
  'block': 'Block this user',
  'unblock': 'Unblock this user'
});

class OneSettings extends Component {
  constructor (props) {
    super(props);
    this.isOwner = (currentUser.get('user_id') === props.model.get('owner_id'));
    this.isAdmin = app.user.isAdmin();
    this.isOp = (_.indexOf(props.model.get('op'), currentUser.get('user_id')) !== -1);
    this.can_delete = true;
    this.state = {
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
  componentDidMount () {
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
  }
  componentWillUnmount () {
    this.props.model.off(this, null, null);
  }
  render () {
    var setRoomNotificationLink = null;
    if (this.props.model.get('type') === 'room') {
      setRoomNotificationLink = (
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('OneSettings:notifications')}
            type='button'
            action
            title={i18next.t('OneSettings:notifications-title')}
            first
            />
          <ListItem
            text={i18next.t('OneSettings:silence')}
            type='switch'
            switchValue={false}
            onSwitch={() => navigation.navigate('AvailableSoon')}
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
        {this._renderLinks()}
        {setRoomNotificationLink}
        {this._renderEnd()}
      </ScrollView>
    );
  }

  _renderLinks () {
    return (
      <View style={s.listGroup}>
        <ListItem
          onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('id'), identifier: this.state.identifier})}
          text={i18next.t('OneSettings:see')}
          icon='eye'
          type='button'
          first
          action
          />
        {this._renderBlock()}
      </View>
    );
  }

  _renderBlock () {
    if (this.state.banned === false) {
      return (
        <ListItem
          onPress={() => this._banUser()}
          text={i18next.t('OneSettings:block')}
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
          text={i18next.t('OneSettings:unblock')}
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
        <Image style={styles.avatarOne} source={{uri: avatarUrl}} />
        <Text style={[styles.statusText, styles.status, this.state.status === 'connecting' && styles.statusConnecting, this.state.status === 'offline' && styles.statusOffline, this.state.status === 'online' && styles.statusOnline]}>{this.state.status}</Text>
      </View>
    );
  }
  _renderEnd () {
    return (
      <View style={s.listGroup}>
        <ListItem
          onPress={() => this.props.model.leave()}
          text={i18next.t('OneSettings:close')}
          type='button'
          first
          warning
          title={i18next.t('OneSettings:end')}
          />
      </View>
    );
  }
}

OneSettings.propTypes = {model: React.PropTypes.object};

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

module.exports = OneSettings;

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  Image,
  ScrollView
} = React;

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var ListItem = require('../components/ListItem');
var currentUser = require('../models/current-user');
var navigation = require('../navigation/index');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'ProfileUser', {
  'registered-on': 'registered on __date__',
  'unlock': 'unblock this user',
  'lock': 'block this user',
  'blocked': 'this user blocked you',
  'discuss': 'Chat',
  'report': 'report user'
});

class UserProfileView extends Component {
  constructor (props) {
    super(props);

    this.data = props.data;
    this.state = {
      banned: this.data.banned
    };
  }
  render () {
    var data = this.data;

    var realname = null;
    if (data.realname) {
      realname = (
        <Text style={styles.realname}>{_.unescape(data.realname)}</Text>
      );
    }

    var bio = _.unescape(data.bio);

    var isBannedLink = null;
    if (data.i_am_banned === true) {
      isBannedLink = (
        <Text style={{marginVertical: 5, marginHorizontal: 5, color: '#ff3838', fontFamily: 'Open Sans', fontSize: 14}}>{i18next.t('ProfileUser:blocked')}</Text>
      );
    }

    var location = null;
    if (data.location) {
      location = (
      <ListItem
        text={_.unescape(data.location)}
        type='text'
        icon='map-marker'
        />
      );
    }

    var website = null;
    if (data.website) {
      website = (
      <ListItem
        text={data.website.title}
        type='edit-button'
        onPress={() => hyperlink.open(data.website.href)}
        first={!data.location}
        action
        icon='link'
        />
      );
    }

    var registeredAt = (
    <ListItem
      type='text'
      text={i18next.t('ProfileUser:registered-on', {date: date.shortDate(data.registered)})}
      first={(!data.location && !data.website)}
      icon='clock-o'
      />
    );

    var bannedLink = null;
    if (this.state.banned === true && data.user_id !== currentUser.get('user_id')) {
      bannedLink = (
        <ListItem
          text={i18next.t('ProfileUser:unlock')}
          type='edit-button'
          action
          onPress={() => this._unbanUser()}
          icon='ban'
          />
      );
    } else if (data.user_id !== currentUser.get('user_id')) {
      bannedLink = (
        <ListItem
          text={i18next.t('ProfileUser:lock')}
          type='edit-button'
          action
          onPress={() => this._banUser()}
          icon='ban'
          iconColor='#ff3838'
          />
      );
    }

    let discuss = null;
    if (data.user_id !== currentUser.get('user_id')) {
      discuss = (
        <View>
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            text={i18next.t('ProfileUser:discuss')}
            type='edit-button'
            first
            action
            onPress={() => app.trigger('joinUser', data.user_id)}
            />
        </View>
      );
    }
    return (
      <ScrollView style={styles.main}>
        <View style={[styles.container, {position: 'relative'}]}>
          {this._renderAvatar(data.avatar)}
          <Text style={[styles.statusText, styles.status, data.status === 'connecting' && styles.statusConnecting, data.status === 'offline' && styles.statusOffline, data.status === 'online' && styles.statusOnline]}>{data.status}</Text>
          {realname}
          <Text style={[styles.username, data.realname && styles.usernameGray]}>@{data.username}</Text>
          <Text style={styles.bio}>{bio}</Text>
          {isBannedLink}
        </View>
        <View style={[s.listGroup]}>
          {discuss}
          <Text style={s.listGroupItemSpacing} />
          {location}
          {website}
          {registeredAt}
          {bannedLink}
          <ListItem
            text={i18next.t('ProfileUser:report')}
            type='edit-button'
            action
            onPress={() => navigation.navigate('Report', {type: 'user', user: data})}
            icon='ban'
            iconColor='#ff3838'
            />
        </View>
      </ScrollView>
    );
  }

  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 150);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  }

  _banUser () {
    app.client.userBan(this.data.user_id, (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: true});
    });
  }

  _unbanUser () {
    app.client.userDeban(this.data.user_id, (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: false});
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  avatar: {
    width: 120,
    height: 120,
    marginTop:20
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  realname: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  status: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'center',
    flex:1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 120,
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
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  iconOnline: {
    color: '#4fedc0'
  },
  bio: {
    marginVertical: 5,
    marginHorizontal: 5,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14
  }
});

module.exports = UserProfileView;

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  Image,
  TouchableHighlight,
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
  'discuss': 'CHAT',
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

    return (
      <ScrollView style={styles.main}>
        <BackgroundComponent avatar={data.avatar} >
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {this._renderAvatar(data.avatar)}
            {this._renderIdentifier()}
            {isBannedLink}
          </View>
        </BackgroundComponent>
        <View style={[s.listGroup]}>
          <Text style={styles.bio}>{bio}</Text>
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

  _renderDiscuss() {
    if (this.props.data.user_id === currentUser.get('user_id')) {
      return null;
    }

    return (
      <Image style={{width: 152.5, height: 35, marginVertical: 20}} source={require('../assets/chat-button.png')} >
        <TouchableHighlight
          underlayColor='transparent'
          style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => app.trigger('joinUser', this.props.data.user_id)}
          >
          <Text style={{ textAlign: 'center', fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#353F4C' }}> {i18next.t('ProfileUser:discuss')} </Text>
        </TouchableHighlight>
      </Image>
    );
  }

  _renderIdentifier() {
    if (this.props.data.realname) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'column'}}>
          <View style={{backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.realname}>{_.unescape(this.props.data.realname)}</Text>
            <View style={[styles.status, this.props.data.status === 'connecting' && styles.statusConnecting, this.props.data.status === 'offline' && styles.statusOffline, this.props.data.status === 'online' && styles.statusOnline]} />
            <Text style={styles.statusText}>{this.props.data.status}</Text>
          </View>
          <Text style={[styles.username, styles.usernameGray]}>@{this.props.data.username}</Text>
          {this._renderDiscuss()}
        </View>
      );
    }

    return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'column'}}>
      <View style={{backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[styles.username, styles.usernameGray]}>@{this.props.data.username}</Text>
        <View style={[styles.status, this.props.data.status === 'connecting' && styles.statusConnecting, this.props.data.status === 'offline' && styles.statusOffline, this.props.data.status === 'online' && styles.statusOnline]} />
        <Text style={styles.statusText}>{this.props.data.status}</Text>
      </View>
      {this._renderDiscuss()}
    </View>
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

var BackgroundComponent = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    avatar: React.PropTypes.string
  },

  render: function() {
    var avatarUrl = null;
    if (this.props.avatar) {
      avatarUrl = common.cloudinary.prepare(this.props.avatar, 300);
    }

    if (avatarUrl) {
      return (
        <Image style={[styles.container, {resizeMode: 'cover'}]} source={{uri: avatarUrl}}>
          {this.props.children}
        </Image>
      );
    }

    return (
      <View style={[styles.container, {position: 'relative'}]}>
        {this.props.children}
      </View>
    );
  }

});
var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop:20
  },
  username: {
    color: '#AFBAC8',
    backgroundColor: 'transparent',
    fontFamily: 'Open Sans',
    fontSize: 16,
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  realname: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '600'
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 4
  },
  statusOnline: { backgroundColor: '#18C095' },
  statusConnecting: { backgroundColor: 'rgb(255, 218, 62)' },
  statusOffline: { backgroundColor: 'rgb(119,119,119)' },
  statusText: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Open Sans',
    backgroundColor: 'transparent'
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
    marginVertical: 20,
    marginHorizontal: 20,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14
  }
});

module.exports = UserProfileView;

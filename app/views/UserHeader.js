'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight
  } = React;

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'UserHeader', {
  'discuss': 'CHAT'
});

var UserHeaderView = React.createClass({
  defaultPropTypes: {
    small: false
  },
  propTypes: {
    model: React.PropTypes.object,
    data: React.PropTypes.any,
    small: React.PropTypes.bool,
    children: React.PropTypes.any
  },
  getInitialState: function () {
    return {
      data: this.props.data ? this.props.data : this.props.model.toJSON()
    };
  },
  componentWillReceiveProps: function () {
    // required to update current user picture in MyAccount when changing avatar
    this.setState({
      data: this.props.data ? this.props.data : this.props.model.toJSON()
    });
  },
  render () {
    return (
      <View style={[styles.container]}>
        <BackgroundComponent avatar={this.state.data.avatar}>
          <View style={{alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center'}}>
            {this._renderAvatar()}
            {this._renderName()}
            {this.props.children}
          </View>
        </BackgroundComponent>
      </View>
    );
  },
  _renderName () {
    if (this.props.data.realname) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'column'}}>
          <View style={{backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.realname}>{_.unescape(this.props.data.realname)}</Text>
            <View style={[styles.status, this.props.data.status === 'connecting' && styles.statusConnecting, this.props.data.status === 'offline' && styles.statusOffline, this.props.data.status === 'online' && styles.statusOnline]}/>
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
          <Text style={[styles.realname]}>@{this.props.data.username}</Text>
          <View style={[styles.status, this.props.data.status === 'connecting' && styles.statusConnecting, this.props.data.status === 'offline' && styles.statusOffline, this.props.data.status === 'online' && styles.statusOnline]}/>
          <Text style={styles.statusText}>{this.props.data.status}</Text>
        </View>
        {this._renderDiscuss()}
      </View>
    );
  },
  _renderDiscuss () {
    if (this.props.data.user_id === currentUser.get('user_id')) {
      return null;
    }

    return (
      <Image style={{width: 152.5, height: 35, marginVertical: 20}} source={require('../assets/chat-button.png')}>
        <TouchableHighlight
          underlayColor='transparent'
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => app.trigger('joinUser', this.props.data.user_id)}
          >
          <Text style={{ textAlign: 'center', fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#353F4C' }}> {i18next.t('UserHeader:discuss')} </Text>
        </TouchableHighlight>
      </Image>
    );
  },
  _renderAvatar () {
    if (this.props.small) {
      return;
    }

    var avatarUrl = common.cloudinary.prepare(this.state.data.avatar, 150);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  }
});

var BackgroundComponent = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    avatar: React.PropTypes.string
  },

  render: function () {
    var avatarUrl = null;
    if (this.props.avatar) {
      avatarUrl = common.cloudinary.prepare(this.props.avatar, 300);
    }

    // @todo implement blur here
    if (avatarUrl) {
      return (
        <Image
          style={{ resizeMode: 'cover', flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}
          source={{uri: avatarUrl}}>
          <View style={{ paddingBottom: 20, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.50)' }}>
            {this.props.children}
          </View>
        </Image>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'stretch',
    flexDirection: 'column'
  },
  avatar: {
    width: 80,
    height: 80,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 40,
    shadowColor: 'rgb(28,36,47)',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.15
  },
  roomname: {
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18
  },
  group: {
    fontFamily: 'Open Sans',
    fontSize: 11,
    color: '#AFBAC8',
    letterSpacing: 0.85,
    lineHeight: 14
  },
  description: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    color: '#394350',
    lineHeight: 14
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
  statusOnline: {backgroundColor: '#18C095'},
  statusConnecting: {backgroundColor: 'rgb(255, 218, 62)'},
  statusOffline: {backgroundColor: 'rgb(119,119,119)'},
  statusText: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Open Sans',
    backgroundColor: 'transparent'
  }
});

module.exports = UserHeaderView;

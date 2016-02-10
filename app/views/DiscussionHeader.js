'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} = React;

var alert = require('../libs/alert');
var app = require('../libs/app');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');
var Icon = require('react-native-vector-icons/EvilIcons');
var navigation = require('../navigation/index');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscussionHeader', {
  'join': 'JOIN',
  'request': 'REQUEST AN ACCESS'
});

var DiscussionHeaderView = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          {this._renderAvatar()}
          {this._renderMode()}
          {this._renderGroup()}
          {this._renderName()}
          {this._renderButton()}
        </View>
        {this._renderDisclaimer()}
      </View>
    );
  },
  _renderGroup() {
    return (
      <View style={{flexDirection: 'column', alignSelf: 'center', justifyContent: 'center'}}>
        <Text style={styles.group}>{this.state.data.group_name ? '#' + this.state.data.group_name : ''}</Text>
      </View>
    );
  },
  _renderName() {
    return (
      <View style={{height: 20, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center'}}>
        <Text style={styles.roomname}>{this.state.data.group_name ? '/' + this.state.data.name :  '#' + this.state.data.name}</Text>
      </View>
    );
  },
  _renderMode() {
    return (
      <Icon
        name={'lock'}
        size={30}
        color='#AFBAC8'
        style={{ position: 'absolute', top:10, right:10, backgroundColor: 'transparent' }}
        />
    );
  },
  _renderAvatar () {
    var avatarUrl = common.cloudinary.prepare(this.state.data.avatar, 130);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  },
  _renderButton() {
    if (!this.props.data.blocked) {
      return (
        <View style={styles.button}>
          <TouchableHighlight onPress={() => app.trigger('joinRoom', this.state.data.room_id)}
                              underlayColor='transparent' >
            <Text style={styles.buttonText}>{i18next.t('DiscussionHeader:join')}</Text>
          </TouchableHighlight>
        </View>
      );
    }

    if (this.props.data.blocked_why === 'disallow') {
      return (
        <View style={styles.button}>
          <TouchableHighlight onPress={() => this.onJoin()}
                              underlayColor='transparent' >
            <Text style={styles.buttonText}>{i18next.t('DiscussionHeader:request')}</Text>
          </TouchableHighlight>
        </View>
      );
    }
  },
  _renderDisclaimer() {

  },
  onJoin: function () {
    app.client.roomBecomeMember(this.state.data.room_id, (data) => {
      if (data.err) {
        return alert.show(i18next.t('message.'+ data.err));
      }
      if (data && data.infos) {
        return navigation.navigate('DiscussionBlockJoin', data.infos, this.state.data);
      } else if (data.success) {
        app.client.roomJoin(this.state.data.room_id, null, function (response) {
          if (data.err) {
            return alert.show(i18next.t('message.'+ data.err));
          }
        });
      }
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'red'
  },
  containerTop: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: '#DDD' // @todo remove
  },
  avatar: {
    width: 80,
    height: 80,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 40,
    shadowColor: 'rgb(28,36,47)',
    shadowOffset: {width: 0, height: 3},
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
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 40,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontFamily: 'Open Sans',
    fontWeight: '600',
    fontSize: 13,
    color: '#353F4C',
    letterSpacing: 1,
    textAlign: 'center',
    paddingVertical: 10
  }
});

module.exports = DiscussionHeaderView;

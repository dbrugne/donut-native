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
          {this.props.children}
        </View>
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
  }
});

module.exports = DiscussionHeaderView;

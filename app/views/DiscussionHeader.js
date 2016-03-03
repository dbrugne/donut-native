'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image
  } = React;

var common = require('@dbrugne/donut-common/mobile');

var DiscussionHeaderView = React.createClass({
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
  render () {
    return (
      <View style={[styles.container]}>
        <BackgroundComponent avatar={this.state.data.avatar}>
          <View style={{alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center'}}>
            {this._renderAvatar()}
            {this._renderMode()}
            {this._renderGroup()}
            {this._renderName()}
            {this.props.children}
          </View>
        </BackgroundComponent>
      </View>
    );
  },
  _renderGroup () {
    return (
      <View
        style={{flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
        <Text
          style={styles.group}>{this.state.data.group_name ? '#' + this.state.data.group_name : ''}</Text>
      </View>
    );
  },
  _renderName () {
    return (
      <View
        style={{height: 20, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
        <Text
          style={styles.roomname}>{this.state.data.group_name ? '/' + this.state.data.name : '#' + this.state.data.name}</Text>
      </View>
    );
  },
  _renderMode () {
    if (!this.state.data.mode || this.state.data.mode === 'public') {
      return null;
    }

    var source = this.state.data.mode === 'private'
      ? require('../assets/lock.png')
      : require('../assets/lock-member.png');

    return (
      <Image style={{width: 14, height: 20, position: 'absolute', top: 10, right: 10}} source={source}/>
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

    // @todo uncomment when blur is ok
    // if (avatarUrl) {
    //   return (
    //     <Image
    //       style={{resizeMode: 'cover', paddingBottom: 20, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center'}}
    //       source={{uri: avatarUrl}}>
    //       {this.props.children}
    //     </Image>
    //   );
    // }

    return (
      <View style={{ paddingBottom: 20, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.50)' }}>
        {this.props.children}
      </View>
    );
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
  }
});

module.exports = DiscussionHeaderView;

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image
  } = React;

var common = require('@dbrugne/donut-common/mobile');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupContent', {
  'rooms': 'Discussion list'
});

var GroupHeaderView = React.createClass({
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
            {this._renderName()}
            {this.props.children}
          </View>
        </BackgroundComponent>
      </View>
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
  },
  _renderName () {
    return (
      <View
        style={{height: 20, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
        <Text
          style={styles.roomname}>{this.state.data.identifier}</Text>
      </View>
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
      <View
        style={{ paddingBottom: 20, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.50)' }}>
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

module.exports = GroupHeaderView;

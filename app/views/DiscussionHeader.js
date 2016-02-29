'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image
} = React;

var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');

var DiscussionHeaderView = React.createClass({
  propTypes: {
    identifier: React.PropTypes.string.isRequired,
    avatar: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      identifier: this.props.identifier,
      avatar: this.props.avatar
    };
  },
  render () {
    return (
        <View style={styles.container}>
          {this._renderAvatar()}
          <Text style={styles.identifier}>{this.state.identifier}</Text>
        </View>
    );
  },
  _renderAvatar () {
    var avatarUrl = common.cloudinary.prepare(this.state.avatar, 150);
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
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 60
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

module.exports = DiscussionHeaderView;

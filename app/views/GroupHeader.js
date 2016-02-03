'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  Image
} = React;

var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var alert = require('../libs/alert');
var Card = require('../components/Card');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupContent', {
  'rooms': 'Discussion list'
});

class GroupHeaderView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      model: props.model
    }
  }

  render () {
    if (!this.state.model) {
      return null;
    }

    return (
        <View style={styles.container}>
          {this._renderAvatar()}
          <Text style={styles.identifier}>{this.state.model.identifier}</Text>
        </View>
    );
  }

  _renderAvatar () {
    if (!this.state.model.avatar) {
      return null;
    }

    var avatarUrl = common.cloudinary.prepare(this.state.model.avatar, 160);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 10
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

module.exports = GroupHeaderView;

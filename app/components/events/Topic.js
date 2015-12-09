'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image
} = React;
var ParsedText = require('react-native-parsed-text');
var hyperlink = require('../../libs/hyperlink');
var navigation = require('../../libs/navigation');
var Username = require('./Username');
var common = require('@dbrugne/donut-common');
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    if (!this.props.data.topic) {
      return;
    }
    var parse = [{
      pattern: common.markup.markupPattern,
      style: s.linksRoom,
      onPress: this.onPress,
      renderText: (string) => {
        var markup = common.markup.markupToObject(string);
        if (!markup) {
          return;
        }
        return markup.title;
      }
    }];
    return (
      <View style={s.topicBlock}>
        <Image style={s.topicBlockAvatar} source={{uri: this.props.data.avatar}}/>
        <Username
          user_id={this.props.data.user_id}
          username={this.props.data.username}
          navigator={this.props.navigator}
        />
        <Text>has changed topic for</Text>
        <ParsedText style={s.topicContent} parse={parse}>
          {this.props.data.topic}
        </ParsedText>
      </View>
    );
  },
  onPress (string) {
    var markup = common.markup.markupToObject(string);
    if (!markup) {
      return;
    }
    if (['url', 'email'].indexOf(markup.type) !== -1) {
      hyperlink.open(markup.href);
    }
    if (['user', 'group', 'room'].indexOf(markup.type) !== -1) {
      let route = navigation.getProfile({
        type: markup.type,
        id: markup.id,
        identifier: markup.title
      });
      this.props.navigator.push(route);
    }
  }
});


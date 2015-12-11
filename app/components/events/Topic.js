'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  Platform
} = React;
var date = require('../../libs/date');
var ParsedText = require('react-native-parsed-text');
var hyperlink = require('../../libs/hyperlink');
var navigation = require('../../libs/navigation');
var Username = require('./Username');
var common = require('@dbrugne/donut-common');
var s = require('../../styles/events');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'topic': 'has changed topic for'
});

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
    var topic;
    if (Platform.OS === 'android') {
      // @todo make parsed text work on android
      topic = (<Text style={s.topicContent}>
        {common.markup.toText(this.props.data.topic)}
      </Text>);
    } else {
      topic = (<ParsedText style={s.topicContent} parse={parse}>
        {this.props.data.topic}
      </ParsedText>);
    }
    var time = date.shortTime(this.props.data.time);
    return (
      <View style={[{flexDirection: 'row', marginVertical: 0}, s.event]}>
        <Image style={s.topicBlockAvatar} source={{uri: this.props.data.avatar}}/>
        <View style={{flexDirection:'column', flex:1, flexWrap: 'wrap'}}>
          <View style={{flexDirection:'row'}}>
            <Username
              style={s.username}
              user_id={this.props.data.user_id}
              username={this.props.data.username}
              navigator={this.props.navigator}
              />
            <Text style={{color: '#666666', fontSize: 12, fontFamily: 'Open Sans', marginLeft: 5}}>{time}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={[s.statusBlockText, {flexWrap: 'wrap'}]}>{i18next.t('local:topic')}</Text>
            <Text style={[s.topicContent, {flexWrap: 'wrap'}]}>{topic}</Text>
          </View>
        </View>
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


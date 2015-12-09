'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  TouchableHighlight,
  Platform
} = React;
var ParsedText = require('react-native-parsed-text');
var _ = require('underscore');
var navigation = require('../../libs/navigation');
var hyperlink = require('../../libs/hyperlink');
var common = require('@dbrugne/donut-common');
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    return (
      <View>
        {this.renderMessage()}
        {this.renderFiles()}
      </View>
    );
  },
  renderMessage () {
    if (!this.props.data.message) {
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
    var text;
    if (Platform.OS === 'android') {
      // @todo make parsed text work on android
      text = (<Text style={s.messageContent}>
        {this.props.data.message}
      </Text>);
    } else {
      text = (<ParsedText style={s.messageContent} parse={parse}>
        {this.props.data.message}
      </ParsedText>);
    }
    return (
      <View style={[s.event, s.message]}>
        {text}
      </View>);
  },
  renderFiles () {
    if (this.props.data.files && this.props.data.files.length > 0) {
      let elements = _.map(this.props.data.files, (element, index) => {
        return (element.type === 'image')
          ? this.renderImage(element, index)
          : this.renderFile(element, index);
      });

      if (!elements.length) {
        return;
      }

      return (
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {elements}
        </View>
      );
    }
  },
  renderFile (element, index) {
    return (
      <TouchableHighlight
        key={this.props.data.id + '-' + index}
        underlayColor='transparent'
        onPress={() => hyperlink.open(element.href)}>
        <Text>PLACEHOLDER FOR DOCUMENTS</Text>
      </TouchableHighlight>
    );
  },
  renderImage (element, index) {
    return (
      <TouchableHighlight
        key={this.props.data.id + '-' + index}
        underlayColor='transparent'
        onPress={() => hyperlink.open(element.href)}>
        <Image style={{width: 250, height: 250, alignSelf: 'center', marginVertical:10, marginHorizontal:10}} source={{uri: element.thumbnail}} />
      </TouchableHighlight>
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


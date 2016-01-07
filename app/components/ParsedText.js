var React = require('react-native');
var {
  View
} = React;

import ParsedText from 'react-native-parsed-text';
var common = require('@dbrugne/donut-common');
var navigation = require('../navigation/index');
var hyperlink = require('../libs/hyperlink');
var s = require('../styles/events');

module.exports = React.createClass({
  render () {
    if (!this.props.children) {
      return (<View />);
    }

    return (
      <ParsedText
        style={this.props.style}
        parse={[{
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
        }]}
      >{this.props.children}</ParsedText>
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
      navigation.navigate('Profile', {
        type: markup.type,
        id: markup.id,
        identifier: markup.title
      });
    }
  }
});

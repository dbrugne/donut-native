var React = require('react-native');
var {
  View
} = React;

var debug = require('../libs/debug')('events');
import ParsedText from 'react-native-parsed-text';
var common = require('@dbrugne/donut-common');
var navigation = require('../libs/navigation');
var hyperlink = require('../libs/hyperlink');
var s = require('../styles/events');

module.exports = React.createClass({
  render () {
    if (!this.props.children) {
      return (<View></View>);
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

    if (!this.props.navigator) {
      return debug.warn('no navigator passed to ParsedText.props');
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

var React = require('react-native');
var {
  View
} = React;

import ParsedText from 'react-native-parsed-text';
var common = require('@dbrugne/donut-common');
var navigation = require('../navigation/index');
var hyperlink = require('../libs/hyperlink');
var s = require('../styles/events');
var userActionSheet = require('../libs/UserActionsSheet');
var roomActionSheet = require('../libs/RoomActionsSheet');
var app = require('../libs/app');

module.exports = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
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
          onPress: (string) => this.onPress(string),
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

    if (markup.type === 'user') {
      userActionSheet.openActionSheet(this.context.actionSheet(), 'roomUsers', null, {user_id: markup.id, username: markup.title.replace('@', '')});
    }

    if (markup.type === 'room') {
      roomActionSheet.openActionSheet(this.context.actionSheet(), {room_id: markup.id, identifier: markup.title});
    }

    if (markup.type === 'group') {
      app.trigger('joinGroup', markup.id);
    }
  }
});

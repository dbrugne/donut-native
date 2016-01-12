'use strict';

var React = require('react-native');

var CardUser = require('./CardUser');
var CardRoom = require('./CardRoom');
var CardGroup = require('./CardGroup');

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func.isRequired,                          // action to do when row is clicked
    type: React.PropTypes.oneOf(['user', 'group', 'room']).isRequired, // type of the result to display user / [room] / group
    identifier: React.PropTypes.string.isRequired,                     // identifier of the row (username / room_identifier / group_name)
    image: React.PropTypes.string,                                     // image to display
    description: React.PropTypes.string,                               // (room / group only).
    bio: React.PropTypes.string,                                       // (user only).
    status: React.PropTypes.string,                                    // (user only).
    realname: React.PropTypes.string,                                  // (user only).
    mode: React.PropTypes.oneOf(['public', 'private', 'member'])       // (room / group only).
  },

  render () {
    switch (this.props.type) {
      case 'user':
        return (<CardUser {...this.props} />);
      case 'group':
        return (<CardGroup {...this.props} />);
      case 'room':
        return (<CardRoom {...this.props} />);
      default:
        return null;
    }
  }
});

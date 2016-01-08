'use strict';

var React = require('react-native');

var SearchResultUser = require('./SearchResult/SearchResultUser');
var SearchResultRoom = require('./SearchResult/SearchResultRoom');
var SearchResultGroup = require('./SearchResult/SearchResultGroup');

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
        return (<SearchResultUser {...this.props} />);
      case 'group':
        return (<SearchResultGroup {...this.props} />);
      case 'room':
        return (<SearchResultRoom {...this.props} />);
      default:
        return null;
    }
  }
});

'use strict';

var React = require('react-native');

var SearchResultUser = require('./SearchResult/SearchResultUser');
var SearchResultRoom = require('./SearchResult/SearchResultRoom');
var SearchResultGroup = require('./SearchResult/SearchResultGroup');

var { Component } = React;

class SearchResult extends Component {
  /**
   * @param props = {
   *   type: type of the result to display user / [room] / group
   *   image: image to display
   *   onPress: action to do when row is clicked
   *   identifier: identifier of the row (username / room_identifier / group_name)
   *   description (room / group only).
   *   bio (user only).
   *   status (user only).
   *   realname (user only).
   * }
   */
  constructor (props) {
    super(props);
  }

  render () {
    if (this.props.type === 'user') {
      return (
        <SearchResultUser {...this.props} />
      );
    }

    if (this.props.type === 'group') {
      return (
        <SearchResultGroup {...this.props} />
      );
    }

    // default type is room
    return (
      <SearchResultRoom {...this.props} />
    );
  }
}

module.exports = SearchResult;
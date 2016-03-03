'use strict';

var React = require('react-native');
var ListItemAbstract = require('./Abstract');

var {
  View
  } = React;

class ListItemTitle extends ListItemAbstract {
  render () {
    return (
      <View style={{flexDirection: 'column'}}>
        {this._renderTitle()}
      </View>
    );
  }
}

module.exports = ListItemTitle;

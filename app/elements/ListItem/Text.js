'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  Text
} = React;

class ListItemButton extends ListItemAbstract {
  _renderElement () {
    return (
      <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
    );
  }
}

module.exports = ListItemButton;
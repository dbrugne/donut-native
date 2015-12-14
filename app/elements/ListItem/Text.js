'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('./style');

var {
  Component,
  View,
  Text,
} = React;

class ListItemButton extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
        {this.props.leftIcon}
        <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
        {this.props.rightIcon}
      </View>
    );
  }
}

module.exports = ListItemButton;
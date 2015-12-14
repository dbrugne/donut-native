'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('./style');

var {
  Component,
  View,
  SwitchAndroid,
  SwitchIOS,
  Text
} = React;

class ListItemSwitch extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    var swicthComponent = null;
    if (this.props.onSwitch) {
      var SwitchComponent;
      if (Platform.OS === 'android') {
        SwitchComponent = SwitchAndroid;
      } else {
        SwitchComponent = SwitchIOS;
      }

      swicthComponent = (
        <SwitchComponent
          style={s.ListGroupItemToggleRight}
          onValueChange={() => this.props.onSwitch()}
          value={this.props.switchValue}
          />
      );
    }

    return (
      <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
        {this.props.leftIcon}
        <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
        {swicthComponent}
      </View>
    );
  }
}

module.exports = ListItemSwitch;
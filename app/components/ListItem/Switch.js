'use strict';

var React = require('react-native');
var Platform = require('Platform');
var ListItemAbstract = require('./Abstract');
var s = require('../../styles/elements/listItem');

var {
  View,
  SwitchAndroid,
  SwitchIOS,
  Text
  } = React;

class ListItemSwitch extends ListItemAbstract {
  _renderElement () {
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
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
        {swicthComponent}
      </View>
    );
  }
}

module.exports = ListItemSwitch;
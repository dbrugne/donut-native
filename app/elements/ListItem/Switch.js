'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('../../styles/elements/listItem');

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
      <View>
        {this._renderTitle()}
        <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
          {this.props.leftIcon}
          <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
          {swicthComponent}
        </View>
      </View>
    );
  }

  _renderTitle() {
    if (!this.props.title) {
      return null;
    }
    return (
      <Text style={s.listGroupTitle}>{this.props.title}</Text>
    );
  }
}

module.exports = ListItemSwitch;
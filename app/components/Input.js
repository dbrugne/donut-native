'use strict';

var React = require('react-native');
var s = require('./../styles/input');

var {
  Component,
  View,
  Text,
  TextInput
} = React;

class Input extends Component {
  /**
   * @param props = {
   *  label: label to display above input if any
   *  help: help message to display bellow input
   * }
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[this.props.style, {flex:1}]}>
        {this._renderLabel()}
        {this._renderInput()}
        {this._renderHelp()}
      </View>
    )
  }

  _renderLabel() {
    if (this.props.label) {
      return (
        <Text style={s.label}>{this.props.label}</Text>
      );
    }
    return null;
  }

  _renderInput() {
    return (
      <TextInput {...this.props} style={s.input} />
    );
  }

  _renderHelp() {
    if (this.props.help) {
      return (
        <Text style={s.help}>{this.props.help}</Text>
      );
    }
    return null;
  }
}

module.exports = Input;
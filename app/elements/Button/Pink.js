'use strict';

var React = require('react-native');
var s = require('./style');

var {
  View,
  TouchableHighlight,
  Component,
  Text
  } = React;

class ButtonPink extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}
                          onLongPress={this.props.onLongPress}
                          onPressIn={this.props.onLongPress}
                          onPressOut={this.props.onLongPress}
                          underlayColor='#FF6CA0'
                          style={[s.button, s.buttonPink, this.props.loading && s.buttonLoading, this.props.disabled && s.buttonDisabled]}>
        <View style={s.textCtn}>
          <Text style={[s.label, s.labelPink, this.props.loading && s.labelLoading, this.props.disabled && s.labelDisabled]}>{this.props.label}</Text>
          {this.props.icon}
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = ButtonPink;
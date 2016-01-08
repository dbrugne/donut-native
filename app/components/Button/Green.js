'use strict';

var React = require('react-native');
var LoadingView = require('../Loading');
var s = require('./../../styles/button');

var {
  View,
  TouchableHighlight,
  Component,
  Text
  } = React;

class ButtonGreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}
                          onLongPress={this.props.onLongPress}
                          onPressIn={this.props.onLongPress}
                          onPressOut={this.props.onLongPress}
                          underlayColor='#41C87A'
                          style={[s.button, s.buttonGreen, this.props.loading && s.buttonLoading, this.props.disabled && s.buttonDisabled]}>
        <View style={s.textCtn}>
          {this._renderText()}
        </View>
      </TouchableHighlight>
    )
  }

  _renderText() {
    if (this.props.loading) {
      return <LoadingView />;
    }

    return (
      <View>
        <Text style={[s.label, s.labelGreen, this.props.loading && s.labelLoading, this.props.disabled && s.labelDisabled]}>{this.props.label}</Text>
        {this.props.icon}
      </View>
    );
  }
}

module.exports = ButtonGreen;
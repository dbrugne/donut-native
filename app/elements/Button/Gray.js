'use strict';

var React = require('react-native');
var LoadingView = require('../Loading');
var s = require('./style');

var {
  View,
  TouchableHighlight,
  Component,
  Text
  } = React;

class ButtonGray extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}
                          onLongPress={this.props.onLongPress}
                          onPressIn={this.props.onLongPress}
                          onPressOut={this.props.onLongPress}
                          underlayColor='#AFBFC0'
                          style={[s.button, s.buttonGray, this.props.loading && s.buttonLoading, this.props.disabled && s.buttonDisabled]}>
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
        <Text style={[s.label, s.labelGray, this.props.loading && s.labelLoading, this.props.disabled && s.labelDisabled]}>{this.props.label}</Text>
        {this.props.icon}
      </View>
    );
  }
}

module.exports = ButtonGray;
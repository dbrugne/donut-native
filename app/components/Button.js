'use strict';

var React = require('react-native');
var s = require('./../styles/button');
var LoadingView = require('./Loading');

var {
  View,
  Text,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var Button = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    loading: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array]),
    buttonStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array])
  },
  render () {
    return (
      <View style={this.props.style}>
        {this._renderButton()}
      </View>
    );
  },
  _renderButton () {
    var underlayColor = this.props.type === 'white'
        ? '#FFFFFF'
        : this.props.type === 'pink'
          ? '#FC2063'
          : this.props.type === 'red'
            ? '#e74c3c'
            : this.props.type === 'gray'
              ? '#FFFFFF'
              : 'transparent';
    return (
      <TouchableHighlight {...this.props}
        underlayColor={underlayColor}
        style={[
          s.button,
          this.props.type === 'white' && s.buttonWhite,
          this.props.type === 'pink' && s.buttonPink,
          this.props.type === 'red' && s.buttonRed,
          this.props.type === 'gray' && s.buttonGray,
          this.props.loading && s.buttonLoading,
          this.props.disabled && s.buttonDisabled,
          this.props.buttonStyle
        ]}>
        <View style={s.textCtn}>
          {this._renderText()}
        </View>
      </TouchableHighlight>
    );
  },
  _renderText () {
    if (this.props.loading) {
      return <LoadingView />;
    }

    return (
      <View>
        <Text
          style={[
            s.label,
            this.props.type === 'white' && s.labelWhite,
            this.props.type === 'pink' && s.labelPink,
            this.props.type === 'red' && s.labelRed,
            this.props.type === 'gray' && s.labelGray,
            this.props.loading && s.labelLoading,
            this.props.disabled && s.labelDisabled
          ]}>
          {this.props.label}
        </Text>
      </View>
    );
  }
});

module.exports = Button;

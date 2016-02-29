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
    help: React.PropTypes.string,
    icon: React.PropTypes.string,
    iconColor: React.PropTypes.string,
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array]),
    buttonStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array])
  },
  render () {
    return (
      <View style={this.props.style}>
        {this._renderButton()}
        {this._renderHelp()}
      </View>
    );
  },
  _renderHelp () {
    if (this.props.help) {
      return (
        <Text style={s.help}>{this.props.help}</Text>
      );
    }
    return null;
  },
  _renderIcon () {
    if (!this.props.icon) {
      return null;
    }

    return (
      <Icon
        name={this.props.icon}
        size={20}
        color={this.props.iconColor ? this.props.iconColor : '#ffda3e'}
        style={s.buttonIcon}
      />
    );
  },
  _renderButton () {
    var underlayColor = this.props.type === 'white'
        ? '#FFFFFF'
        : this.props.type === 'blue'
          ? '#2980B9'
          : this.props.type === 'green'
            ? '#27ae60'
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
          this.props.type === 'blue' && s.buttonBlue,
          this.props.type === 'green' && s.buttonGreen,
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
            this.props.type === 'blue' && s.labelBlue,
            this.props.type === 'green' && s.labelGreen,
            this.props.type === 'pink' && s.labelPink,
            this.props.type === 'red' && s.labelRed,
            this.props.type === 'gray' && s.labelGray,
            this.props.loading && s.labelLoading,
            this.props.disabled && s.labelDisabled
          ]}>
          {this.props.label}
        </Text>
        {this._renderIcon()}
      </View>
    );
  }
});

module.exports = Button;

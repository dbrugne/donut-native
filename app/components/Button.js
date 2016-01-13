'use strict';

var React = require('react-native');
var s = require('./../styles/button');
var LoadingView = require('./Loading');

var {
  View,
  Text,
  TouchableHighlight
  } = React;
var { Icon } = require('react-native-icons');

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
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number])
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
    return (
      <TouchableHighlight {...this.props}
        underlayColor='#FFFFFF'
        style={[
          s.button,
          this.props.type === 'white' && s.buttonWhite,
          this.props.type === 'blue' && s.buttonBlue,
          this.props.type === 'green' && s.buttonGreen,
          this.props.type === 'pink' && s.buttonPink,
          this.props.type === 'red' && s.buttonRed,
          this.props.type === 'gray' && s.buttonGray,
          this.props.loading && s.buttonLoading,
          this.props.disabled && s.buttonDisabled
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

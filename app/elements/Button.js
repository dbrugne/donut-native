'use strict';

var React = require('react-native');
var ButtonBlue = require('./Button/Blue');
var ButtonGray = require('./Button/Gray');
var ButtonGreen = require('./Button/Green');
var ButtonPink = require('./Button/Pink');
var ButtonRed = require('./Button/Red');
var ButtonWhite = require('./Button/White');
var s = require('./Button/style');

var {
  Component,
  View,
  Text
  } = React;
var {
  Icon
  } = require('react-native-icons');

class Button extends Component {
  /**
   * @param props = {
   *  onPress: callback action when button is pressed
   *  onLongPress: callback action when button is long pressed
   *  loading: true / [false]
   *  disabled : true / [false]
   *  type: gray|default / blue / green / red / pink|primary / white : style to apply to the button
   *  help: help message bellow if any
   *  icon: fontawesome code name of the icon to append top the button text
   *  iconColor: color of the icon, default is #ffda3e
   * }
   */
  constructor(props) {
    super(props);

    this.icon = null;
    if (this.props.icon) {
      let iconColor = (this.props.iconColor ? this.props.iconColor : '#ffda3e');
      this.icon = (
        <Icon
          name={this.props.icon}
          size={20}
          color={iconColor}
          style={s.buttonIcon}
          />
      );
    }
  }

  render() {
    return (
      <View style={this.props.style}>
        {this._renderButton()}
        {this._renderHelp()}
      </View>
    )
  }

  _renderHelp() {
    if (this.props.help) {
      return (
        <Text style={s.help}></Text>
      );
    }
    return null;
  }

  _renderButton() {
    let Element = ButtonGray;
    switch (this.props.type) {
      case 'blue':
        Element = ButtonBlue;
        break;
      case 'green':
        Element = ButtonGreen;
        break;
      case 'primary':
      case 'pink':
        Element = ButtonPink;
        break;
      case 'red':
        Element = ButtonRed;
        break;
      case 'white':
        Element = ButtonWhite;
        break;
      case 'default':
      case 'gray':
      default:
        Element = ButtonGray;
        break;
    }

    return (
      <Element {...this.props} icon={this.icon} />
    );
  }
}

module.exports = Button;
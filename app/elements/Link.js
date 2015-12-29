'use strict';

var React = require('react-native');
var LinkUnderlined = require('./Link/Underlined');
var LinkBold = require('./Link/Bold');

var {
  Component,
  View,
  Text,
  TouchableHighlight
} = React;

class Link extends Component {
  /**
   * @param props = {
   *  onPress: callback action when button is pressed
   *  text: text to display on link
   *  type: underlined|default / bold|username : style to apply to the button
   *  linkStyle: style to apply to the text
   * }
   */
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <View style={this.props.style}>
        {this._renderLink()}
      </View>
    )
  }

  _renderLink() {
    let Element = LinkUnderlined;
    switch (this.props.type) {
      case 'bold':
      case 'username':
        Element = LinkBold;
        break;
      case 'underlined':
      case 'default':
        default:
        Element = LinkUnderlined;
        break;
    }

    return (
      <Element {...this.props} />
    );
  }
}

module.exports = Link;
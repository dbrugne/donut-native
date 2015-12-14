'use strict';

var React = require('react-native');
var s = require('./style');

var {
  View,
  TouchableHighlight,
  Component,
  Text
  } = React;

class LinkUnderlined extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight style={[s.link, s.linkUnderlined]}
                          onPress={() => this.props.onPress()}
                          underlayColor='transparent'
        >
        <Text>
          <Text>{this.props.prepend}</Text>
          <Text style={[s.text, s.textUnderlined, this.props.linkStyle]}>
            {this.props.text}
          </Text>
          <Text>{this.props.append}</Text>
        </Text>
      </TouchableHighlight>
    )
  }
}

module.exports = LinkUnderlined;
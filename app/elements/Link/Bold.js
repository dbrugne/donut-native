'use strict';

var React = require('react-native');
var s = require('./style');

var {
  View,
  TouchableHighlight,
  Component,
  Text
  } = React;

class LinkBold extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight style={[s.link, s.linkBold]}
                          onPress={() => this.props.onPress()}
                          underlayColor='transparent'
        >
        <Text>
          <Text>{this.props.prepend}</Text>
          <Text style={[s.text, s.textBold, this.props.linkStyle]}>
            {this.props.text}
          </Text>
          <Text>{this.props.append}</Text>
        </Text>
      </TouchableHighlight>
    )
  }
}

module.exports = LinkBold;
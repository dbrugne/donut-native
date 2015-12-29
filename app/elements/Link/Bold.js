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

    this.prepend = (this.props.prepend ? this.props.prepend + ' ' : '');
    this.append = (this.props.append ? ' ' + this.props.append : '');
  }

  render() {
    return (
      <TouchableHighlight style={[s.link, s.linkBold]}
                          onPress={() => this.props.onPress()}
                          underlayColor='transparent'
        >
        <View>
          <Text>
            <Text style={this.props.prependStyle}>{this.prepend}</Text>
            <Text style={[s.text, s.textBold, this.props.linkStyle]}>
              {this.props.text}
            </Text>
            <Text style={this.props.appendStyle}>{this.append}</Text>
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = LinkBold;
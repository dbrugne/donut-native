'use strict';

var React = require('react-native');
var s = require('./../../styles/link');

var {
  View,
  TouchableHighlight,
  Component,
  Text
  } = React;
class LinkUnderlined extends Component {
  constructor(props) {
    super(props);

    this.prepend = (this.props.prepend ? this.props.prepend + ' ' : '');
    this.append = (this.props.append ? ' ' + this.props.append : '');
  }

  render() {
    return (
      <View style={this.props.style}>
        <TouchableHighlight style={[s.link, s.linkUnderlined]}
                            onPress={() => this.props.onPress()}
                            underlayColor='transparent'
          >
          <View>
            <Text>
              <Text style={this.props.prependStyle}>{this.prepend}</Text>
              <Text style={[s.text, s.textUnderlined, this.props.linkStyle]}>
                {this.props.text}
              </Text>
              <Text style={this.props.appendStyle}>{this.append}</Text>
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = LinkUnderlined;
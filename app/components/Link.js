'use strict';

var React = require('react-native');

var {
  Component,
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;

class Link extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight style={styles.container}
                          onPress={() => this.props.onPress()}
                          underlayColor= 'transparent'
        >
        <Text style={[styles.text, this.props.linkStyle]}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {

  },
  text: {
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

module.exports = Link;
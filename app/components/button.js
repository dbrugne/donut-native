'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} = React;

// @source: if problem with android add switch code http://stackoverflow.com/questions/29872918/how-to-add-a-button-in-react-native

class Button extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.onPress} style={styles.button}>
          <Text style={styles.label}>{this.props.label}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    marginVertical: 9,
    paddingHorizontal: 9
  },
  button: {
    backgroundColor: '#95a5a6',
    borderRadius: 5,
    padding: 10
  },
  label: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

module.exports = Button;
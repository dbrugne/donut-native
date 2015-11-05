'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View,
  Component,
  TextInput,
} = React;

class InputView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: 'hello world!',
    };
  }
  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput style={styles.input}
                   onChangeText={(text) => this.setState({text})}
                   value={this.state.text} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  inputContainer: {
    left: 0,
    right: 0,
    borderColor: '#d9d9d9',
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  input: {
    padding: 3,
    paddingHorizontal: 5,
    height: 40,
  }
});

module.exports = InputView;

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
      text: ''
    };

    this.model = props.model;
  }
  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput style={styles.input}
                   ref='input'
                   autoFocus={true}
                   onChangeText={(text) => this.setState({text})}
                   onSubmitEditing={this.onSubmit.bind(this)}
                   placeholder='Envoyer un message'
                   blurOnSubmit={false}
                   value={this.state.text}
                   enablesReturnKeyAutomatically={true}
                   returnKeyType='send'
          />
      </View>
    );
  }
  onSubmit () {
    this.model.sendMessage(this.state.text);
    this.setState({
      text: ''
    });
    this.refs.input.focus(); // @todo : not working due to blurOnSubmit https://github.com/facebook/react-native/pull/2149
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
    height: 40
  }
});

module.exports = InputView;

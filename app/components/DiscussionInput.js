'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Component,
  TextInput
} = React;
var {
  Icon
  } = require('react-native-icons');
var Button = require('react-native-button');
var imageUpload = require('../libs/imageUpload');
var app = require('../libs/app');

class InputView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: ''
    };

    this.model = props.model;
  }
  render() {
    var inputPlaceholder = 'Message ' + ((this.model.get('type') === 'room') ? 'dans ' + this.model.get('identifier') : 'à @' + this.model.get('username'));
    return (
      <View style={styles.inputContainer}>
        <Button style={styles.button} onPress={() => this._addImage()}>
          <Icon
            name='fontawesome|camera'
            size={28}
            color='#FC2063'
            style={styles.icon}
            />
        </Button>
        <TextInput style={styles.input}
                   ref='input'
                   onChangeText={(text) => this.setState({text})}
                   placeholder={inputPlaceholder}
                   blurOnSubmit={false}
                   value={this.state.text}
                   multiline={true}
          />
        <Button style={styles.button} onPress={() => this.onSubmit()}>
          <Icon
            name='fontawesome|paper-plane'
            size={28}
            color='#FC2063'
            style={styles.icon}
            />
        </Button>
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
  _addImage () {
    imageUpload.pickImage((canceled, response) => {
      if (canceled) {
        return;
      }
      // set image source for the confirmation modal
      this.props.setImageSource(response.data);
      // show confirmation modal with the image
      this.props.showConfirmationModal();
    });
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
    borderBottomWidth: 0,
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    padding: 3,
    paddingHorizontal: 5,
    height: 40,
    fontSize: 14
  },
  icon: {
    width: 28,
    height: 28,
    marginHorizontal: 5,
    marginTop: 5
  },
  button: {
    flex: 1,
    width: 40
  }
});

module.exports = InputView;

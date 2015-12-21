'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Component,
  TextInput,
} = React;
var {
  Icon
  } = require('react-native-icons');
var Button = require('react-native-button');
var imageUpload = require('../libs/imageUpload');
var Alert = require('../libs/alert');
var app = require('../libs/app');

class InputView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: ''
    };

    this.model = props.model;
  }
  componentDidMount () {
    // hide keyboard by triggering blur on TextInput
    app.on('drawerWillOpen', () => this.refs.input.blur(), this);
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }
  render() {
    return (
      <View style={styles.inputContainer}>
        <Button style={styles.button} onPress={() => this._addImage()}>
          <Icon
            name='fontawesome|plus'
            size={34}
            color='#666'
            style={styles.icon}
            />
        </Button>
        <TextInput style={styles.input}
                   ref='input'
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
  _addImage () {
    imageUpload.getImageAndUpload(null, 'discussion', (err, response) => {
      if (err) {
        return Alert.show(err);
      }
      this.model.sendMessage(null, [response]);
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
    height: 40
  },
  icon: {
    width: 34,
    height: 34,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5
  },
  button: {
    flex: 1,
    width: 40
  }
});

module.exports = InputView;

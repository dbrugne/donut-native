'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
  TextInput,
  ScrollView,
  LayoutAnimation,
  DeviceEventEmitter
} = React;

var app = require('../libs/app');
var client = require('../libs/client');
var _ = require('underscore');

var animation = {
  duration: 400,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 400,
  },
};

class RoomView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: '',
      text: 'hello world!',
      keyboardSpace: 0
    };
  }
  componentDidMount () {
    client.on('room:message', _.bind(function (data) {
      if (data.room_id !== this.props.currentRoute.id) {
        return;
      }

      this.setState({
        messages: this.state.messages + '\n@' + data.username + ': ' + data.message
      });
    }, this));
  }
  componentWillMount () {
    DeviceEventEmitter.addListener('keyboardWillShow', (frames) => {
      LayoutAnimation.configureNext(animation);
      this.setState({keyboardSpace: frames.endCoordinates.height});
    });
    DeviceEventEmitter.addListener('keyboardWillHide', () => {
      LayoutAnimation.configureNext(animation);
      this.setState({keyboardSpace: 0});
    });
  }
  render() {
    console.log('render with keyboardSpace', this.state.keyboardSpace);
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Room {this.props.currentRoute.title}</Text>
        <ScrollView style={styles.events}>
          <Text style={styles.title}>{this.state.messages}</Text>
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input}
                     onChangeText={(text) => this.setState({text})}
                     value={this.state.text} />
        </View>
        <View style={{height: this.state.keyboardSpace}}></View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00FF00',
  },
  title: {
  },
  events: {
    flex: 1
  },
  inputContainer: {
    left: 0,
    right: 0,
//    backgroundColor: '#FF0000',
//    position: 'absolute',
//    bottom: 0,
  },
  // http://stackoverflow.com/questions/29313244/how-to-auto-slide-the-window-out-from-behind-keyboard-when-textinput-has-focus
  // http://stackoverflow.com/questions/29541971/absolute-and-flexbox-in-react-native
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  }
});

module.exports = RoomView;

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

var EventsView = require('./DiscussionEventsView');
var InputView = require('./DiscussionInputView');

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
      keyboardSpace: 0
    };

    this.model = props.currentRoute.model;
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
        <EventsView title={this.props.currentRoute.title} model={this.model} />
        <InputView />
        <View style={{backgroundColor: '#FF0000', height: this.state.keyboardSpace}}></View>
      </View>
    );
  }
}

// http://stackoverflow.com/questions/29313244/how-to-auto-slide-the-window-out-from-behind-keyboard-when-textinput-has-focus
// http://stackoverflow.com/questions/29541971/absolute-and-flexbox-in-react-native
var styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  },
  events: {
    flex: 1
  }
});

module.exports = RoomView;

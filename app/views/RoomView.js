'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Component,
  LayoutAnimation,
  DeviceEventEmitter
} = React;

var EventsView = require('./DiscussionEventsView');
var InputView = require('./DiscussionInputView');
var animation = require('../libs/animations').keyboard;

class RoomView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      keyboardSpace: 0
    };

    this.model = props.currentRoute.model;
  }
  componentDidMount () {
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
    return (
      <View style={styles.main}>
        <EventsView title={this.props.currentRoute.title} model={this.model} />
        <InputView model={this.model} />
        <View style={{height: this.state.keyboardSpace}}></View>
      </View>
    );
  }
}

// @source: http://stackoverflow.com/questions/29313244/how-to-auto-slide-the-window-out-from-behind-keyboard-when-textinput-has-focus
// @source: http://stackoverflow.com/questions/29541971/absolute-and-flexbox-in-react-native
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

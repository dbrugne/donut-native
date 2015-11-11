'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Component,
  LayoutAnimation,
  DeviceEventEmitter
} = React;

var _ = require('underscore');
var EventsView = require('./DiscussionEventsView');
var InputView = require('./DiscussionInputView');
var animation = require('../libs/animations').keyboard;

class DiscussionView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      keyboardSpace: 0
    };

    this.model = props.currentRoute.model;
    this.subscription = [];
  }
  componentDidMount () {
    this.subscription.push(DeviceEventEmitter.addListener('keyboardWillShow', (frames) => {
      LayoutAnimation.configureNext(animation);
      this.setState({keyboardSpace: frames.endCoordinates.height});
    }));
    this.subscription.push(DeviceEventEmitter.addListener('keyboardWillHide', () => {
      LayoutAnimation.configureNext(animation);
      this.setState({keyboardSpace: 0});
    }));
    this.subscription.push(this.props.navigator.navigationContext.addListener('didfocus', (event) => {
      var route = event.data.route;
      if (route.id !== this.props.currentRoute.id) {
        return;
      }
//      console.log('i was focused', this.props.currentRoute.title);
      if (!this.refs.events.onFocus) {
        return console.log('FOUND ERRROR onFocus', this.props.currentRoute.title);
      }
      this.refs.events.onFocus();
    }));
  }
  componentWillUnmount () {
    _.each(this.subscription, (s) => s.remove());
  }
  render() {
    return (
      <View style={styles.main}>
        <EventsView ref='events' title={this.props.currentRoute.title} model={this.model} />
        <InputView ref='input' model={this.model} />
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

module.exports = DiscussionView;

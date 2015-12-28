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
var debug = require('../libs/debug')('navigation');
var EventsView = require('../components/DiscussionEvents');
var InputView = require('../components/DiscussionInput');
var animation = require('../libs/animations').keyboard;

class Discussion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      keyboardSpace: 0
    };
  }
  componentDidMount () {
    debug.log(this.props.model.get('identifier') + ' mounted');
    this.subscription = [
      DeviceEventEmitter.addListener('keyboardWillShow', (frames) => {
        LayoutAnimation.configureNext(animation);
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }),
      DeviceEventEmitter.addListener('keyboardWillHide', () => {
        LayoutAnimation.configureNext(animation);
        this.setState({keyboardSpace: 0});
      })
    ];
  }
  componentWillUnmount () {
    debug.log(this.props.model.get('identifier') + ' unmounted');
    _.each(this.subscription, (s) => s.remove());
  }
  render() {
    return (
      <View style={styles.main}>
        <EventsView ref='events' title={this.props.model.get('identifier')} model={this.props.model} {...this.props} />
        <InputView ref='input' model={this.props.model} />
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

module.exports = Discussion;

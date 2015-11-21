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
var EventsView = require('../components/DiscussionEvents');
var InputView = require('../components/DiscussionInput');
var animation = require('../libs/animations').keyboard;

class Discussion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      keyboardSpace: 0
    };

    this.model = props.model;
  }
  componentDidMount () {
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

    // @todo : history load
//    this.subscription.push(this.props.parentNavigator.navigationContext.addListener('didfocus', (event) => {
//      var route = event.data.route;
//      if (route.id !== this.model.get('id')) {
//        return;
//      }
//      if (!this.refs.events.onFocus) {
//        return console.log('FOUND ERRROR onFocus', this.model.get('id'));
//      }
//      this.refs.events.onFocus();
//    }));
  }
  componentWillUnmount () {
    _.each(this.subscription, (s) => s.remove());
  }
  render() {
    return (
      <View style={styles.main}>
        <EventsView ref='events' title={this.model.get('identifier')} model={this.model} {...this.props} />
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

module.exports = Discussion;

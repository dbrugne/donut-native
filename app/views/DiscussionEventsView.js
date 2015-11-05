'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
  ScrollView,
  ListView,
  NativeModules
} = React;

var app = require('../libs/app');
var client = require('../libs/client');
var _ = require('underscore');

var InputView = require('./DiscussionInputView');
var EventsView = require('./DiscussionEventsView');

// @todo : scroll up to load more : https://gist.github.com/jsdf/6930c0211e0dc5bf0227 https://github.com/jsdf/react-native-refreshable-listview

function measureCallback(ox, oy, width, height, px, py) {
  console.log("ox: " + ox);
  console.log("oy: " + oy);
  console.log("width: " + width);
  console.log("height: " + height);
  console.log("px: " + px);
  console.log("py: " + py);
}

class RoomView extends Component {
  constructor (props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.data.id !== r2.data.id
    });
    this.state = {
      messages: ds.cloneWithRows({}),
    };

    this.model = props.model;
    this.shouldScrollToBottom = false;
  }
  componentDidMount () {
    client.on('room:message', _.bind(function (data) {
      if (data.room_id !== this.props.currentRoute.id) {
        return;
      }

//      this.setState({
//        messages: this.state.messages + '\n@' + data.username + ': ' + data.message
//      });
    }, this));

    // initial history load
    console.log('load', this.model.get('identifier'));
    this.model.history(null, null, (response) => {
      if (!response.history || !response.history.length) {
        return;
      }
      this.setState({
        messages: this.state.messages.cloneWithRows(response.history)
      });

      this.shouldScrollToBottom = true;

      // @todo : handle more
    });
  }
  componentDidUpdate () {
    if (this.shouldScrollToBottom === true) {
      setTimeout(() => { // @bug react-native
        console.log(this.refs.listView.scrollProperties);
        var navBarHeight = 45;
        var inputHeight = 41;
        var viewportHeight = NativeModules.UIManager.Dimensions.window.height;
        var eventsHeight = viewportHeight - navBarHeight - inputHeight;
        var scrollTo = this.refs.listView.scrollProperties.contentLength - eventsHeight;
        console.log(viewportHeight, eventsHeight, scrollTo);
        this.refs.listView.getScrollResponder().scrollTo(scrollTo);
        this.shouldScrollToBottom = false;
      }, 1000);
    }
  }
  render () {
    return (
      <View ref='container' style={styles.container}>
        <ListView
          ref='listView'
          pageSize={16}
          scrollEventThrottle={64}
          style={styles.listView}
          dataSource={this.state.messages}
          renderHeader={this.renderHeader.bind(this)}
          renderRow={this.renderEvent}
          renderFooter={this.renderFooter.bind(this)}
          onScroll={this.onScroll}
          />
      </View>
    );
  }
  renderHeader () {
    return (
      <Text style={styles.title}>You are in {this.props.title}</Text>
    );
  }
  renderEvent (event) {
    return (
      <Text style={styles.event}>{event.type} {event.data.id}</Text>
    );
  }
  renderFooter () {
    return (
      <Text style={styles.title}>end</Text>
    );
  }
  onScroll (event: Object) {
    console.log(event.nativeEvent.contentOffset.y);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#424242',
    fontFamily: 'Open Sans',
    marginVertical: 15
  },
  listView: {
    flex: 1
  },
  event: {
    fontSize: 12,
    color: '#666666'
  }
});

module.exports = RoomView;

'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
  ScrollView,
  ListView,
  NativeModules
} = React;

var InvertibleScrollView = require('react-native-invertible-scroll-view');

var app = require('../libs/app');
var client = require('../libs/client');
var _ = require('underscore');
var InputView = require('./DiscussionInputView');
var EventsView = require('./DiscussionEventsView');

class RoomView extends Component {
  constructor (props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.data.id !== r2.data.id
    });
    this.state = {
      loading: false,
      more: true,
      messages: ds.cloneWithRows({}),
    };

    this.model = props.model;
    this.topEvent = null;
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
    this.setState({
      loading: true
    });
    this.model.history(null, null, (response) => {
      if (!response.history || !response.history.length) {
        return;
      }
      this.setState({
        messages: this.state.messages.cloneWithRows(response.history),
        loading: false,
        more: response.more
      });
    });
  }
  render () {
    return (
      <View ref='container' style={styles.container}>
        <ListView
          ref='listView'
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          style={styles.listView}
          dataSource={this.state.messages}
          renderRow={this.renderEvent.bind(this)}
          renderFooter={this.renderHeader.bind(this)}
          onScroll={this.onScroll}
          />
      </View>
    );
    /**
     pageSize={16}
     scrollEventThrottle={32}
     onEndReached={this.onEndReached.bind(this)}
     onEndReachedThreshold={16}
     */
  }
  renderEvent (event) {
    this.topEvent = event.data.id;
    var dd = new Date(event.data.time);
    var time = dd.getHours() + ':' + dd.getMinutes();
    return (
      <Text style={styles.event}>{event.type} {event.data.id} {time}</Text>
    );
  }
  renderHeader () {
    if (!this.state.more) {
      return (
        <Text style={[styles.title, {'backgroundColor': '#FF0000'}]}>You are in {this.props.title}</Text>
      );
    }

    var loading = (<View style={{height: 40}} />);
    if (this.state.loading) {
      loading = (
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size='small'
          color='#666666'
          />
      );
    }

    return (
      <View>
        {loading}
        <TouchableHighlight
          onPress={this.onLoadMore.bind(this)}
          style={styles.button}>
          <Text>Load more</Text>
        </TouchableHighlight>
      </View>
    );
  }
  onLoadMore (event: Object) {
    this.setState({
      loading: true
    });
    this.model.history(null,this.topEvent, (response) => {
      if (!response.history || !response.history.length) {
        return;
      }
      this.setState({
        messages: this.state.messages.cloneWithRows(response.history),
        loading: false,
        more: response.more
      });
    });
  }
  onScroll (event: Object) {
//    console.log(event.nativeEvent.contentOffset.y);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  button: {
  padding: 20,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'black',
  }
});

module.exports = RoomView;

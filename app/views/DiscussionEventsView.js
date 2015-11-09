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

var _ = require('underscore');
var app = require('../libs/app');
var client = require('../libs/client');
var events = require('../libs/events');
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
      dataSource: ds.cloneWithRows([])
    };

    this.model = props.model;
    this.eventsBlob = [];
    this.topEvent = null;
  }
  componentDidMount () {
    this.model.on('freshEvent', this.addFreshEvent.bind(this));

    // initial history load
    this._loadHistory();
  }
  render () {
    return (
      <View ref='container' style={styles.container}>
        <ListView
          ref='listView'
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
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
     renderSectionHeader={this.renderSectionHeader.bind(this)}
     renderSeparator={this.renderSeparator.bind(this)}
     */
  }
  renderRow (event, sectionID, rowID, highlightRow) {
    if (!event.data) {
      console.log('empty', event);
      return (<Text/>)
    }
    this.topEvent = event.data.id;
    return events.render(event);
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
//  renderSectionHeader (sectionData, sectionID) {
//    console.log('renderSectionHeader', sectionData, sectionID);
//    return (
//      <Text>renderSectionHeader</Text>
//    );
//  }
//  renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
//    console.log('renderSeparator', sectionID, rowID, adjacentRowHighlighted);
//  }
  onLoadMore (event: Object) {
    this._loadHistory(this.topEvent);
  }
  _loadHistory (end) {
    this.setState({
      loading: true
    });
    this.model.history(null, end, (response) => {
      if (!response.history || !response.history.length) {
        return;
      }
      this.eventsBlob = this.eventsBlob.concat(response.history);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.eventsBlob),
        loading: false,
        more: response.more
      });
    });
  }
  onScroll (event: Object) {
//    console.log(event.nativeEvent.contentOffset.y);
  }
  addFreshEvent (type, data) {
    // add to list top, the inverted view will display on bottom
    this.eventsBlob = [{type: type, data: data}].concat(this.eventsBlob);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.eventsBlob)
    });
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
  button: {
  padding: 20,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'black',
  }
});

module.exports = RoomView;

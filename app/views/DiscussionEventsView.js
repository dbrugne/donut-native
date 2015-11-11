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
    this.bottomEvent = null;
    this.wasFocusedAtLeastOneTime = false;
  }
  componentDidMount () {
    this.model.on('freshEvent', this.addFreshEvent.bind(this));
  }
  componentWillUnmount () {
    this.model.off('freshEvent');
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
          renderHeader={this.renderFooter.bind(this)}
          renderFooter={this.renderHeader.bind(this)}
          onChangeVisibleRows={this.onChangeVisibleRows.bind(this)}
          pageSize={4}
          />
      </View>
    );
    /**
     onScroll={this.onScroll}
     pageSize={16}
     scrollEventThrottle={32}
     onEndReached={this.onEndReached.bind(this)}
     onEndReachedThreshold={16}
     renderSectionHeader={this.renderSectionHeader.bind(this)}
     renderSeparator={this.renderSeparator.bind(this)}
     */
  }
  renderRow (event, sectionID, rowID, highlightRow) {
    // inverted ListView is always rendered from last to first chronological event
    // (from bottom to top)

    if (!event.data) {
      return (<Text/>)
    }
    this.topEvent = event.data.id;

    if (rowID > 0) {
      var previous = this.state.dataSource.getRowData(0, (rowID - 1));
    }

    // rowID is a string
    var isLast = (parseInt(rowID) === (this.eventsBlob.length - 1));

    return events.render(event, previous, isLast);
  }
  renderHeader () {
    if (!this.state.more) {
      var prefix = (this.model.get('type') === 'room')
        ? 'Your are in'
        : 'You discuss with'
      return (
        <Text style={styles.title}>{prefix} {this.props.title}</Text>
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
  renderFooter () {
    return (
      <View style={styles.footer} />
    );
  }
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

      if (!_.isArray(response.history)) {
        return;
      }

      // response.history last
      var last = response.history[response.history.length - 1];
      this.topEvent = last.id;

      // response.history first
      if (!this.bottomEvent) {
        var first = response.history[0];
        if (first && first.id) {
          this.bottomEvent = first.id;
        }
      }
    });
  }
  onChangeVisibleRows (visibleRows, changedRows) {
    // @todo implement viewed event sending
//    console.log(visibleRows, changedRows);
  }
  addFreshEvent (type, data) {
    // add on list top, the inverted view will display on bottom
    this.eventsBlob = [{type: type, data: data}].concat(this.eventsBlob);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.eventsBlob)
    });
    this.bottomEvent = data.id;
  }
  onFocus () {
    // first focus
    if (!this.wasFocusedAtLeastOneTime) {
      this._loadHistory()
      this.wasFocusedAtLeastOneTime = true;
    }
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
  },
  footer: {
    paddingBottom: 5 // elegant spacer under last event
  }
});

module.exports = RoomView;

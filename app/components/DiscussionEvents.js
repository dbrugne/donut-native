'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
  ListView
} = React;

var InvertibleScrollView = require('react-native-invertible-scroll-view');

var _ = require('underscore');
var app = require('../libs/app');
var client = require('../libs/client');
var events = require('../libs/events');
var s = require('../styles/style');

class DiscussionEvents extends Component {
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
    return events.render(event, previous, isLast, this.props.navigator);
  }
  renderHeader () {
    if (!this.state.more) {
      var prefix = (this.model.get('type') === 'room')
        ? 'Your are in'
        : 'You discuss with';
      return (
        <Text style={[s.h1, s.textCenter]}>{prefix} {this.props.title}</Text>
      );
    }

    var loading = (<View />);
    if (this.state.loading) {
      loading = (
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[styles.centering, {height: 10}]}
          size='small'
          color='#666666'
          />
      );
    }

    return (
      <View>
        {loading}
        <TouchableHighlight style={[{padding: 10, borderStyle: 'solid', borderBottomWidth: 1}, s.buttonGray]}
                            underlayColor= '#DDD'
                            onPress={this.onLoadMore.bind(this)}
          >
          <Text style={[s.buttonTextLight, s.textCenter]}>Load more</Text>
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
    this.model.history(null, end, 40, (response) => {
      if (!response.history || !response.history.length) {
        return this.setState({
          loading: false,
          more: false
        });
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
      this._loadHistory();
      this.wasFocusedAtLeastOneTime = true;
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listView: {
    flex: 1
  },
  footer: {
    paddingBottom: 5 // elegant spacer under last event
  }
});

module.exports = DiscussionEvents;

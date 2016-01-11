'use strict';

/**
 * Inverted ListView is always rendered from last to first chronological event
 * (from bottom to top)
 *
 * Datasource contains event from newer (index 0) to older
 */

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  Text,
  View,
  Component,
  ListView
} = React;
var _ = require('underscore');
var Button = require('react-native-button');
var InvertibleScrollView = require('react-native-invertible-scroll-view');

var debug = require('../libs/debug')('events');
var app = require('../libs/app');
var s = require('../styles/style');

var eventsPrepare = require('../libs/eventsPrepare');
var EventDate = require('./../components/events/Date');
var EventMessage = require('./../components/events/Message');
var EventPromote = require('./../components/events/Promote');
var EventUserPromote = require('./../components/events/UserPromote');
var EventStatus = require('./../components/events/Status');
var EventTopic = require('./../components/events/Topic');
var UserBlock = require('./../components/events/UserBlock');
var Unviewed = require('./../components/events/Unviewed');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'in': 'You are in',
  'discuss': 'You discuss with',
  'load-more': 'Load more'
});

class DiscussionEvents extends Component {
  markAsViewedTimeout = null;

  constructor (props) {
    super(props);

    this.eventsDataSource = require('../libs/eventsDataSource')();
    this.state = {
      loading: false,
      more: true,
      dataSource: this.eventsDataSource.dataSource
    };

    this.wasFocusedAtLeastOneTime = false;
    this.numberOfEventsToRetrieve = 40;

    app.on('room:join', this.onJoin, this);
  }
  componentDidMount () {
    app.on('viewedEvent', this.refreshData.bind(this), this);
    this.props.model.on('freshEvent', this.addFreshEvent.bind(this), this);
    this.props.model.on('messageSpam', this.onMarkedAsSpam.bind(this), this);
    this.props.model.on('messageUnspam', this.onMarkedAsUnspam.bind(this), this);
    this.props.model.on('messageEdit', this.onEdited.bind(this), this);
  }
  componentWillUnmount () {
    this.props.model.off(null, null, this);

    this._timeoutCleanup();
  }
  _timeoutCleanup () {
    if (this.markAsViewedTimeout) {
      clearInterval(this.markAsViewedTimeout);
      this.markAsViewedTimeout = null;
    }
  }
  render () {
    return (
      <View ref='container' style={{flex: 1}}>
        <ListView
          ref='listView'
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          style={{flex: 1}}
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
  renderRow (event) {
    var data = eventsPrepare(event.type, event.data);
    var Comp = this.getComponent(event.type);

    if (!Comp) {
      return (<View />);
    }

    if (event.data.userBlock) {
      return(
      <UserBlock
        navigator={this.props.navigator}
        data={event.data.userBlock}
        >
        <Comp
          navigator={this.props.navigator}
          type={event.type}
          data={data}
          />
      </UserBlock>
      );
    }

    return (
      <Comp
        navigator={this.props.navigator}
        type={event.type}
        data={data}
      />
    );
  }
  getComponent (type) {
    if (type === 'unviewed') {
      return Unviewed;
    }
    if (type === 'date') {
      return EventDate;
    }
    if (type === 'room:topic') {
      return EventTopic;
    }
    if (['room:message', 'user:message'].indexOf(type) !== -1) {
      return EventMessage;
    }
    if (['user:online', 'user:offline', 'room:out', 'room:in'].indexOf(type) !== -1) {
      return EventStatus;
    }
    if (['user:ban', 'user:deban'].indexOf(type) !== -1) {
      return EventUserPromote;
    }
    if (['room:op', 'room:deop', 'room:kick', 'room:ban', 'room:deban',
        'room:voice', 'room:devoice', 'room:groupban', 'room:groupdisallow'].indexOf(type) !== -1) {
      return EventPromote;
    }

    debug.warn('unable to find event component', type); // return undefined
  }
  renderHeader () {
    if (!this.state.more) {
      var prefix = (this.props.model.get('type') === 'room')
        ? i18next.t('local:in')
        : i18next.t('local:discuss');
      return (
        <Text style={[s.h1, s.textCenter]}>{prefix} {this.props.title}</Text>
      );
    }

    var loading = (<View />);
    if (this.state.loading) {
      loading = (
        <ActivityIndicatorIOS
          animating={this.state.loading}
          style={[{height: 10}]}
          size='small'
          color='#666666'
        />
      );
    }

    return (
      <View style={[s.textCenter, {marginVertical: 15}]}>
        <View style={[s.textCenter, {marginVertical: 15}]}>
          {loading}
        </View>
        <Button onPress={() => this.onLoadMore('older')}>
          {i18next.t('local:load-more')}
        </Button>
      </View>
    );
  }
  renderFooter () {
    return (
      <View style={{paddingBottom: 5}} />
    );
  }
  onLoadMore () {
    this.fetchHistory('older');
  }
  fetchHistory (direction) {
    if (direction === 'older') {
      this.setState({
        loading: true
      });
    }

    let id = (direction === 'older')
      ? this.eventsDataSource.getTopItemId()
      : this.eventsDataSource.getBottomItemId();

    this.props.model.history(id, direction, this.numberOfEventsToRetrieve, (response) => {
      var state = {};

      if (direction === 'older') {
        state.loading = false;
        state.more = (response.more || (response.history && response.history.length));
      } else {
        if (response.more) {
          // handle too many new events on refocus
          this.eventsDataSource.blob = [];
        }
      }

      if (response.history && response.history.length) {
        let method = (direction === 'older')
          ? 'prepend'
          : 'append';
        state.dataSource = this.eventsDataSource[method](response.history, this.props.model.get('first_unviewed'));
      }

      this.setState(state);
    });
  }
  onChangeVisibleRows (visibleRows, changedRows) {
    // @todo : maybe not the best event to mark as read?
    this.markAsViewedAfterDelay();
  }
  addFreshEvent (type, data) {
    if (this.props.model.get('focused') !== true) {
      // render realtime event only if discussion is focused
      return;
    }

    // add on list top, the inverted view will display on bottom
    this.setState({
      dataSource: this.eventsDataSource.append([{type: type, data: data}], this.props.model.get('first_unviewed'))
    });
  }
  onMarkedAsSpam (data) {
    var id = data.event;
    if (!id) {
      return;
    }

    this.setState({
      dataSource: this.eventsDataSource.updateEvent(id, {spammed: true})
    });
  }
  onMarkedAsUnspam (data) {
    var id = data.event;
    if (!id) {
      return;
    }

    this.setState({
      dataSource: this.eventsDataSource.updateEvent(id, {spammed: false})
    });
  }
  refreshData() {
    this.setState({
      dataSource: this.eventsDataSource.removeUnviewedBlock()
    });
  }
  onEdited (data) {
    var id = data.event;
    if (!id) {
      return;
    }

    this.setState({
      dataSource: this.eventsDataSource.updateEvent(id, {edited: true, message: data.message})
    });
  }
  onFocus () {
    // first focus
    if (!this.wasFocusedAtLeastOneTime) {
      this.fetchHistory('older');
      this.wasFocusedAtLeastOneTime = true;
    } else {
      // on refocus load history from last blur
      this.fetchHistory('later');
    }

    this.markAsViewedAfterDelay();
  }
  markAsViewedAfterDelay () {
    this._timeoutCleanup();

    // is unviewed?
    if (this.props.model.get('unviewed') !== true) {
      return;
    }

    this.markAsViewedTimeout = setTimeout(() => {
      this.props.model.markAsViewed();
    }, 2000); // 2s
  }
}

module.exports = DiscussionEvents;
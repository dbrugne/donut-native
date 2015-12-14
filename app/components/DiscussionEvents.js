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
var Button = require('react-native-button');
var InvertibleScrollView = require('react-native-invertible-scroll-view');

var debug = require('../libs/debug')('events');
var app = require('../libs/app');
var client = require('../libs/client');
var s = require('../styles/style');

var eventsPrepare = require('../libs/eventsPrepare');
var EventDate = require('./events/Date');
var EventMessage = require('./events/Message');
var EventPromote = require('./events/Promote');
var EventUserPromote = require('./events/UserPromote');
var EventStatus = require('./events/Status');
var EventTopic = require('./events/Topic');
var EventUser = require('./events/User');

const HISTORY_LIMIT = 40;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'in': 'Your are in',
  'discuss': 'You discuss with',
  'load-more': 'Load more'
});

class DiscussionEvents extends Component {
  constructor (props) {
    super(props);

    this.eventsDataSource = require('../libs/eventsDataSource')();
    this.state = {
      loading: false,
      more: true,
      dataSource: this.eventsDataSource.dataSource
    };

    this.wasFocusedAtLeastOneTime = false;

    app.on('room:join', this.onJoin, this);
  }
  componentDidMount () {
    this.props.model.on('freshEvent', this.addFreshEvent.bind(this), this);
  }
  componentWillUnmount () {
    this.props.model.off(null, null, this);
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
    // @todo : big bug for user:message, we should use from_user_id => refactor whole user message for having the same form as room:message + a to_user_id field?
    var data = eventsPrepare(event.type, event.data);
    var Comp = this.getComponent(event.type);
    return (
      <Comp
        navigator={this.props.navigator}
        type={event.type}
        data={data}
      />
    );
  }
  getComponent (type) {
    if (type === 'date') {
      return EventDate;
    }
    if (type === 'user') {
      return EventUser;
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

    debug.warn('unable to find event component', type);
    return (<View />);
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
        <Button onPress={this.onLoadMore.bind(this)}>
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
    let end = this.eventsDataSource.getTopItemId();
    this._loadHistory(end);
  }
  _loadHistory (end) {
    this.setState({
      loading: true
    });
    this.props.model.history(null, end, HISTORY_LIMIT, (response) => {
      if (!response.history || !response.history.length) {
        return this.setState({
          loading: false,
          more: false
        });
      }

      this.setState({
        dataSource: this.eventsDataSource.prepend(response.history),
        loading: false,
        more: response.more
      });
    });
  }
  onChangeVisibleRows (visibleRows, changedRows) {
    // @todo implement viewed event sending
  }
  addFreshEvent (type, data) {
    // add on list top, the inverted view will display on bottom
    this.setState({
      dataSource: this.eventsDataSource.append({type: type, data: data})
    });
  }
  onFocus () {
    // first focus
    if (!this.wasFocusedAtLeastOneTime) {
      this._loadHistory();
      this.wasFocusedAtLeastOneTime = true;
    }
  }
}

module.exports = DiscussionEvents;

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
var s = require('../styles/style');

var eventsPrepare = require('../libs/eventsPrepare');
var EventDate = require('./../components/events/Date');
var EventMessage = require('./../components/events/Message');
var EventPromote = require('./../components/events/Promote');
var EventUserPromote = require('./../components/events/UserPromote');
var EventStatus = require('./../components/events/Status');
var EventTopic = require('./../components/events/Topic');
var EventHello = require('./../components/events/Hello');
var UserBlock = require('./../components/events/UserBlock');
var Unviewed = require('./../components/events/Unviewed');
var discussionActionSheet = require('../libs/DiscussionActionsSheet');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscussionEvents', {
  'in': 'You are in',
  'discuss': 'Chat with',
  'load-more': 'Load more'
});

class DiscussionEvents extends Component {
  markAsViewedTimeout = null;

  constructor (props) {
    super(props);

    this.loading = false;
    this.eventsDataSource = require('../libs/eventsDataSource')();
    this.state = {
      loading: false,
      more: true,
      dataSource: this.eventsDataSource.dataSource
    };

    this.wasFocusedAtLeastOneTime = false;
    this.numberOfEventsToRetrieve = 40;
  }
  componentDidMount () {
    this.props.model.on('freshEvent', this.addFreshEvent, this);
    this.props.model.on('messageSpam', this.onMarkedAsSpam, this);
    this.props.model.on('messageUnspam', this.onMarkedAsUnspam, this);
    this.props.model.on('messageEdit', this.onEdited, this);
    this.props.model.on('change:unviewed', this.onUnviewedChange, this);
    this.props.model.on('view-spammed', this.onViewSpammed, this);
    this.props.model.on('remask-spammed', this.onRemaskSpammed, this);
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
    var Comp = this.getComponent(event);

    if (!Comp) {
      return (<View />);
    }

    if (event.data.userBlock && event.data.first) {
      return(
      <UserBlock
        navigator={this.props.navigator}
        data={event.data.userBlock}
        >
        <Comp
          navigator={this.props.navigator}
          type={event.type}
          data={data}
          model={this.props.model}
          renderActionSheet={() => this._renderActionSheet(data)}
          />
      </UserBlock>
      );
    }

    return (
      <Comp
        navigator={this.props.navigator}
        type={event.type}
        data={data}
        model={this.props.model}
        renderActionSheet={() => this._renderActionSheet(data)}
      />
    );
  }
  getComponent (event) {
    let type = event.type;
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
    if (type === 'room:in' && event.data.user_id === app.user.get('user_id')) {
      return EventHello;
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
        ? i18next.t('DiscussionEvents:in')
        : i18next.t('DiscussionEvents:discuss');
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
          {i18next.t('DiscussionEvents:load-more')}
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
    this.loading = direction;
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
        state.more = response.more;
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
      this.loading = false;

      if (this.props.model.get('focused') === true) {
        this.markAsViewedAfterDelay();
      }
    });
  }
  addFreshEvent (type, data) {
    if (this.props.model.get('focused') !== true) {
      // render realtime event only if discussion is focused
      return;
    }
    if (this.loading === 'later') {
      // don't add event if we already loading new events
      return;
    }

    // add on list top, the inverted view will display on bottom
    this.setState({
      dataSource: this.eventsDataSource.append([{type: type, data: data}], this.props.model.get('first_unviewed'))
    });
    this.markAsViewedAfterDelay();
  }
  onMarkedAsSpam (data) {
    var id = data.event;
    if (!id) {
      return;
    }

    this.setState({
      dataSource: this.eventsDataSource.updateEvent(id, {spammed: true, viewed: false})
    });
  }
  onMarkedAsUnspam (data) {
    var id = data.event;
    if (!id) {
      return;
    }

    this.setState({
      dataSource: this.eventsDataSource.updateEvent(id, {spammed: false, viewed: false})
    });
  }
  onUnviewedChange (model, nowIsUnviewed) {
    if (!nowIsUnviewed) {
      this.setState({
        dataSource: this.eventsDataSource.removeUnviewedBlock()
      });
    }
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
  _renderActionSheet (data) {
    discussionActionSheet.openActionSheet(this.context.actionSheet(), this.props.model, data);
  }
  onViewSpammed (messageId) {
    this.setState({
      dataSource: this.eventsDataSource.updateEvent(messageId, {viewed: true})
    });
  }
  onRemaskSpammed (messageId) {
    this.setState({
      dataSource: this.eventsDataSource.updateEvent(messageId, {viewed: false})
    });
  }
}

DiscussionEvents.contextTypes = {
  actionSheet: React.PropTypes.func
};

module.exports = DiscussionEvents;

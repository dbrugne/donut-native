'use strict';

var React = require('react-native');
var _ = require('underscore');
var app = require('../libs/app');
var navigation = require('../libs/navigation');
var ListItem = require('../elements/ListItem');
var LoadingView = require('../elements/Loading');
var alert = require('../libs/alert');
var common = require('@dbrugne/donut-common/mobile');
var date = require('../libs/date');
var currentUser = require('../models/current-user');
var s = require('../styles/style');

var {
  View,
  ListView,
  Component,
  TouchableHighlight,
  Text,
  Image
  } = React;
var {
  Icon
  } = require('react-native-icons');

var i18next = require('../libs/i18next');

class NotificationsView extends Component {

  constructor (props) {
    super(props);
    this.timeouts = {
      loadingMore: null,
      loadingTagAsRead: null,
      loadingTagAsDone: null
    };
    this.timeoutTimer = 2000; // 2sec
    this.notificationsDataSource = require('../libs/notificationsDataSource')();
    this.state = {
      loaded: false,
      loadingMore: false,
      loadingTagAsRead: false,
      loadingTagAsDone: false,
      selecting: false,
      error: null,
      unread: 0,
      more: false,
      discussionsUnviewed: app.getUnviewed(),
      dataSource: this.notificationsDataSource.dataSource
    };
  }

  componentDidMount () {
    currentUser.on('change:unreadNotifications', this.fetchData.bind(this));
    app.on('viewedEvent', this.updateDiscussionsUnviewed.bind(this));
    app.on('unviewedEvent', this.updateDiscussionsUnviewed.bind(this));
    app.client.on('notification:done', this.onDoneNotification.bind(this));
  }

  componentWillUnmount () {
    currentUser.off('change');
    app.off('viewedEvent');
    app.off('unviewedEvent');
  }

  onFocus () {
    this.fetchData();
  }

  fetchData () {
    return app.client.notificationRead(null, null, 10, this.onData.bind(this));
  }

  onData (response) {
    if (response.err) {
      return this.setState({
        error: true
      });
    }
    this.setState({
      loaded: true,
      dataSource: this.notificationsDataSource.append(response.notifications),
      unread: currentUser.getUnreadNotifications(),
      more: response.more
    });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }
    if (this.state.error) {
      alert.show(i18next.t('messages.notification-read-error'));
      return (
        <View />
      );
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderHeader={this.renderHeader.bind(this)}
        renderFooter={this.renderFooter.bind(this)}
        style={{flex: 1, backgroundColor: '#f0f0f0'}}
        scrollEnabled
        />
    );
  }

  renderHeader () {
    let unviewedDiscussions = null;
    if (this.state.discussionsUnviewed !== 0) {
      unviewedDiscussions = (
        <View>
          <ListItem type='button'
                    onPress={() => navigation.openDrawer()}
                    first
                    last
                    action
                    text={i18next.t('notifications.discussion-count', {count: this.state.discussionsUnviewed})}
            />
          <Text style={s.listGroupItemSpacing}/>
        </View>
      );
    }

    let unreadNotifications = null;
    if (this.state.unread === 0) {
      unreadNotifications = (
        <View style={{marginHorizontal: 10, marginBottom: 30}}>
          <Text>{i18next.t('notifications.no-unread-notification')}</Text>
        </View>
      );
    } else {
      unreadNotifications = (
        <ListItem type='button'
                  onPress={this.tagAllAsRead.bind(this)}
                  loading={this.state.loadingTagAsRead}
                  first
                  last
                  action
                  title={i18next.t('notifications.notification-count', {count: this.state.unread})}
                  text={i18next.t('notifications.mark-as-read')}
          />
      );
    }

    return (
      <View style={{marginTop: 30}}>
        {unviewedDiscussions}
        {unreadNotifications}
      </View>
    );
  }

  renderFooter () {
    if (this.state.selecting) {
      return (
        <View>
          <Text style={s.listGroupItemSpacing}/>
          <ListItem type='button'
                    onPress={this.markSelectedAsDone.bind(this)}
                    loading={this.state.loadingTagAsDone}
                    text={i18next.t('notifications.delete-selected')}
                    first
                    warning
            />
          <ListItem type='button'
                    onPress={this.cancelSelecting.bind(this)}
                    text={i18next.t('cancel')}
            />
        </View>
      );
    }
    if (!this.state.more) {
      return null;
    }

    if (this.state.loadingMore) {
      return (
        <View style={{height: 50}}>
          <LoadingView />
        </View>
      );
    }

    return (
      <TouchableHighlight
        underlayColor='#f0f0f0'
        onPress={this.onLoadMore.bind(this)}
        style={{height: 50, justifyContent: 'center', alignItems: 'center'}}
        >
        <Text style={{textAlign: 'center'}}>{i18next.t('notifications.load-more')}</Text>
      </TouchableHighlight>
    );
  }

  renderRow (n) {
    n.css = '';
    n.name = '';
    n.avatarCircle = false;
    if (n.data.room) {
      n.avatar = common.cloudinary.prepare(n.data.room.avatar, 45);
      n.avatarCircle = true;
      n.title = n.data.room.name;
      n.name = n.data.room.name;
      var roomId = (n.data.room._id)
        ? n.data.room._id
        : n.data.room.id;
      n.onPress = _.bind(function () {
        this.props.navigator.push(navigation.getProfile({type: 'room', id: roomId, identifier: n.name}));
      }, this);
    } else if (n.data.group) {
      n.avatar = common.cloudinary.prepare(n.data.group.avatar, 45);
      n.avatarCircle = true;
      n.title = n.data.group.name;
      n.name = n.data.group.name;
      var groupId = (n.data.group._id)
        ? n.data.group._id
        : n.data.group.id;
      n.onPress = () => navigation.switchTo(navigation.getGroup({name: n.name, id: groupId}));
    } else if (n.data.by_user) {
      n.avatar = common.cloudinary.prepare(n.data.by_user.avatar, 45);
      n.title = n.data.by_user.username;
    }

    n.username = (n.data.by_user)
      ? n.data.by_user.username
      : n.data.user.username;
    var message = (n.data.message)
      ? common.markup.toText(n.data.message)
      : '';
    n.message = i18next.t('notifications.messages.' + n.type, {
      name: n.name,
      username: n.username,
      message: message,
      topic: (n.data.topic)
        ? common.markup.toText(n.data.topic)
        : ''
    });

    if (['roomjoinrequest', 'groupjoinrequest', 'usermention'].indexOf(n.type) !== -1) {
      var avatar = (n.data.by_user)
        ? n.data.by_user.avatar
        : n.data.user.avatar;
      n.avatar = common.cloudinary.prepare(avatar, 45);
      n.avatarCircle = false;
    }
    if (n.type === 'roomjoinrequest') {
      n.onPress = null;
      n.css += 'open-room-users-allowed';
      n.username = null;
    } else if (n.type === 'groupjoinrequest') {
      n.onPress = null;
      n.css += 'open-group-users-allowed';
      n.username = null;
    } else if (n.type === 'roomdelete') {
      n.onPress = null;
    }

    if (n.viewed === false) {
      n.css += ' unread';
    }

    return this._renderNotification(n);
  }

  _renderNotification (n) {
    if (n.onPress) {
      return (
        <TouchableHighlight
          style={{backgroundColor: '#ffffff'}}
          underlayColor='#f0f0f0'
          onPress={this.state.selecting ? this.onLongPress.bind(this, n) : n.onPress}
          onLongPress={this.onLongPress.bind(this, n)}
          >
          {this._renderContent(n)}
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          style={{backgroundColor: '#ffffff'}}
          underlayColor='#f0f0f0'
          onLongPress={this.onLongPress.bind(this, n)}
          >
          {this._renderContent(n)}
        </TouchableHighlight>
      );
    }
  }

  onLongPress (elt) {
    var id = elt.id;
    if (!id) {
      return;
    }

    let selecting = true;
    let selected = this.notificationsDataSource.findWhere('selected', true);
    if (selected.length === 1 && _.has(elt, 'selected') && elt.selected) {
      selecting = false;
    }

    this.setState({
      selecting: selecting,
      dataSource: this.notificationsDataSource.update(id, {selected: _.has(elt, 'selected') ? !elt.selected : true})
    });
  }

  /**
   * Click button "Cancel"
   */
  cancelSelecting () {
    this.setState({
      selecting: false,
      dataSource: this.notificationsDataSource.clearSelection()
    });
  }

  /**
   * click button "Delete selected"
   * @returns {*}
   */
  markSelectedAsDone () {
    // prevent multiple click on button
    if (this.state.loadingTagAsDone === true) {
      return;
    }

    // get selected from datasource
    let selected = this.notificationsDataSource.findWhere('selected', true);
    if (selected.length === 0) {
      return this.cancelSelecting();
    }
    let selectedIds = _.map(selected, (e) => {
      return e.id;
    });

    // set button state as loading
    this.setState({loadingTagAsDone: true});

    // Add timeout to prevent loading too long & display error message
    this.timeouts.loadingTagAsDone = setTimeout(() => {
      alert.show(i18next.t('messages.error-try-again'));
      this.setState({loadingTagAsDone: false});
    }, this.timeoutTimer);

    // call client to tag selected notifications as done and display error message if required
    app.client.notificationDone(selectedIds, false, (err, data) => {
      if (err && err.err) {
        alert.show(i18next.t('messages.' + err.err));
      }
    });
  }

  /**
   * If receiving message from server that some notifications as been done
   * @param data
   */
  onDoneNotification (data) {
    clearTimeout(this.timeouts.loadingTagAsDone);

    let state = {loadingTagAsDone: false};

    // remove notifications from blob & close selecting buttons (delete & cancel)
    if (data.notifications && data.notifications.length > 0) {
      state.dataSource = this.notificationsDataSource.markAsDone(data.notifications);
      state.selecting = false;
    }

    this.setState(state);
  }

  _renderContent (n) {
    return (
      <View
        style={[{ paddingTop:5, paddingBottom:5, paddingLeft:5, paddingRight:5, borderBottomWidth:1, borderBottomColor:'#f1f1f1', borderStyle:'solid'}, !n.viewed && {borderBottomColor:'#d8deea', backgroundColor: 'rgba(237, 239, 245, .98)'}]}>
        <View style={{ flexDirection:'row', justifyContent:'center', flex:1}}>
          {this._renderAvatar(n)}
          <View style={{ flexDirection:'column', justifyContent:'center', flex:1, marginLeft:10}}>
            <Text>{n.message}</Text>
            <View style={{ flexDirection:'row', alignItems:'center', flex:1}}>
              <Text style={{ flex:1, fontSize:14 }}>{this._renderByUsername(n)}</Text>
              <Text style={{ color:'#999999', fontSize:12 }}>{date.dayMonthTime(n.time)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  _renderAvatar (n) {
    if (n.selected) {
      return (
        <View
          style={[{ width: 44, height: 44, borderRadius: 4, backgroundColor: '#3498db', flexDirection: 'row' }, n.avatarCircle && {borderRadius:22}]}>
          <Icon
            name='fontawesome|check'
            size={30}
            color='#ecf0f1'
            style={{width: 30, height: 30, alignSelf:'center', marginLeft:6}}
            />
        </View>
      );
    }

    if (!n.avatar) {
      return null;
    }

    return (
      <Image style={[{ width: 44, height: 44, borderRadius: 4 }, n.avatarCircle && {borderRadius:22}]}
             source={{uri: n.avatar}}/>
    );
  }

  _renderByUsername (n) {
    if (!n.username) {
      return null;
    }

    return (
      <Text>{i18next.t('by-username', {username: n.username}) }</Text>
    );
  }

  onLoadMore () {
    this.setState({loadingMore: true});

    // Add timeout to prevent loading too long & display error message
    this.timeouts.loadingMore = setTimeout(() => {
      alert.show(i18next.t('messages.error-try-again'));
      this.setState({loadingMore: false});
    }, this.timeoutTimer);

    app.client.notificationRead(null, this.notificationsDataSource.getBottomItemTime(), 10, (data) => {
      clearTimeout(this.timeouts.loadingMore);
      this.setState({
        loadingMore: false,
        more: data.more,
        unread: data.unread,
        dataSource: this.notificationsDataSource.prepend(data.notifications)
      });
    });
  }

  tagAllAsRead () {
    this.setState({loadingTagAsRead: true});

    // Add timeout to prevent loading too long & display error message
    this.timeouts.loadingTagAsRead = setTimeout(() => {
      alert.show(i18next.t('messages.error-try-again'));
      this.setState({loadingTagAsRead: false});
    }, this.timeoutTimer);

    app.client.notificationViewed([], true, () => {
      clearTimeout(this.timeouts.loadingTagAsRead);
      this.setState({
        loadingTagAsRead: false,
        unread: 0,
        dataSource: this.notificationsDataSource.tagAsRead()
      });
    });
  }

  updateDiscussionsUnviewed () {
    this.setState(
      {discussionsUnviewed: app.getUnviewed()}
    );
  }
}

module.exports = NotificationsView;

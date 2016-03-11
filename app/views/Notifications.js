'use strict';

var React = require('react-native');
var _ = require('underscore');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var Username = require('../components/events/Username');
var LoadingView = require('../components/Loading');
var alert = require('../libs/alert');
var common = require('@dbrugne/donut-common/mobile');
var date = require('../libs/date');
var emojione = require('emojione');
var state = require('../navigation/state');

var {
  View,
  ListView,
  Component,
  TouchableHighlight,
  Text,
  Image
  } = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'Notifications', {
  'alerts': 'Alerts',
  'mark-as-read': 'MARK ALL NOTIFICATIONS AS READ',
  'discussion-count': '__count__ UNREAD DISCUSSION',
  'discussion-count_plural': '__count__ UNREAD DISCUSSIONS',
  'delete-selected': 'DELETE SELECTED',
  'cancel': 'CANCEL'
});

class NotificationsView extends Component {
  constructor (props) {
    super(props);
    this.timeouts = {
      loadingMore: null,
      loadingTagAsRead: null,
      loadingTagAsDone: null,
      visibleRows: null
    };
    this.timeoutTimer = 10000; // 10sec
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
    app.client.on('notification:new', this.newIncomingNotification, this);
    app.client.on('notification:done', this.onDoneNotification, this);
    app.client.on('notification:viewed', this.onViewedNotification, this);
    app.user.on('change:unviewedDiscussion', this.updateDiscussionsUnviewed, this);
    app.user.on('change:unviewedNotification', this.updateNotificationsUnviewed, this);
  }

  componentWillUnmount () {
    app.client.off(null, null, this);
    app.off(null, null, this);
  }

  onFocus () {
    this.fetchData();
  }

  fetchData () {
    this.notificationsDataSource.blob = [];
    return app.client.notificationRead(null, null, 10, (data) => {
      app.client.userPreferencesRead(null, (response) => {
        this.setState({
          mobileAlerts: response.preferences && response.preferences['notif:channels:mobile']
        });
        return this.onData(data);
      });
    });
  }

  newIncomingNotification (data) {
    // if notification view is focused
    if (state.currentRoute && state.currentRoute.id === 'notification') {
      this.setState({
        dataSource: this.notificationsDataSource.append(data),
        unread: app.user.get('unviewedNotification')
      });
    }
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
      unread: app.user.get('unviewedNotification'),
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
      <View style={{flex:1}}>
        <ListItem text={i18next.t('Notifications:alerts')}
                  type='switch'
                  onSwitch={() => this.onChangeMobileNotifications()}
                  switchValue={this.state.mobileAlerts}
                  style={{marginHorizontal: 10}}
          />
        {this._renderHeader()}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          style={{flex: 1}}
          scrollEnabled
          />
      </View>
    );
  }

  _renderHeader () {
    if (this.state.selecting) {
      return (
        <View style={{marginTop: 20, marginHorizontal: 20}}>
          <Button type='gray'
                  onPress={this.markSelectedAsDone.bind(this)}
                  loading={this.state.loadingTagAsDone}
                  label={i18next.t('Notifications:delete-selected')}
            />

          <Button type='red'
                  onPress={this.cancelSelecting.bind(this)}
                  label={i18next.t('Notifications:cancel')}
                  style={{marginVertical: 20}}
            />
        </View>
      );
    }

    let unviewedDiscussions = null;
    if (this.state.discussionsUnviewed !== 0) {
      unviewedDiscussions = (
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <Button type='gray'
                  onPress={() => navigation.openDrawer()}
                  label={i18next.t('Notifications:discussion-count', {count: this.state.discussionsUnviewed})}
            />
        </View>
      );
    }

    let unread = this.state.unread === 0
        ? (<Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#586473', textAlign: 'center' }}>{i18next.t('notifications.no-unread-notification')}</Text>)
        : (<Button type='gray'
                   onPress={this.tagAllAsRead.bind(this)}
                   loading={this.state.loadingTagAsRead}
                   label={i18next.t('Notifications:mark-as-read')}
        />)
      ;

    return (
      <View>
        {unviewedDiscussions}
        <View style={{marginHorizontal: 20, marginVertical: 20}}>
          {unread}
        </View>
      </View>
    );
  }

  renderFooter () {
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
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontFamily: 'Open Sans', fontSize: 14, color: '#8491A1'}}>● ● ●</Text>
          <Text style={{textAlign: 'center', fontFamily: 'Open Sans', fontSize: 14, color: '#8491A1' }}>{i18next.t('notifications.load-more')}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderRow (n) {
    n.css = '';
    n.name = '';
    n.avatarCircle = false;
    if (n.data.room) {
      n.avatar = common.cloudinary.prepare(n.data.room.avatar, 50);
      n.avatarCircle = true;
      n.title = n.data.room.name;
      n.name = n.data.room.name;
      var roomId = (n.data.room._id)
        ? n.data.room._id
        : n.data.room.id;
      if (app.rooms.iwhere('id', roomId)) {
        // if room in drawer navigation focus discussion
        n.onPress = () => app.trigger('joinRoom', roomId);
      } else {
        n.onPress = () => navigation.navigate('Profile', {
          type: 'room',
          id: roomId,
          identifier: n.name
        });
      }
    } else if (n.data.group) {
      n.avatar = common.cloudinary.prepare(n.data.group.avatar, 50);
      n.avatarCircle = true;
      n.title = n.data.group.name;
      n.name = n.data.group.name;
      var groupId = (n.data.group._id)
        ? n.data.group._id
        : n.data.group.id;
      n.onPress = () => app.trigger('joinGroup', groupId);
    } else if (n.data.by_user) {
      n.avatar = common.cloudinary.prepare(n.data.by_user.avatar, 50);
      n.title = n.data.by_user.username;
    }

    n.username = (n.data.by_user)
      ? n.data.by_user.username
      : n.data.user.username;
    var message = (n.data.message)
      ? common.markup.toText(n.data.message)
      : '';
    var topic = (n.data.topic)
      ? common.markup.toText(n.data.topic)
      : '';
    n.message = i18next.t('notifications.messages.' + n.type, {
      name: n.name,
      username: n.username,
      message: (message) ? emojione.shortnameToUnicode(message) : '',
      topic: (topic) ? emojione.shortnameToUnicode(topic) : ''
    });

    if (['roomjoinrequest', 'groupjoinrequest', 'usermention'].indexOf(n.type) !== -1) {
      var avatar = (n.data.by_user)
        ? n.data.by_user.avatar
        : n.data.user.avatar;
      n.avatar = common.cloudinary.prepare(avatar, 50);
      n.avatarCircle = false;
    }
    if (n.type === 'roomjoinrequest') {
      n.css += 'open-room-users-allowed';
      n.onPress = () => navigation.navigate('AvailableSoon');
    } else if (n.type === 'groupjoinrequest') {
      n.css += 'open-group-users-allowed';
      n.onPress = () => navigation.navigate('AvailableSoon');
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
          onPress={this.state.selecting ? this.onLongPress.bind(this, n) : () => n.onPress()}
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

  onChangeMobileNotifications () {
    var update = {'notif:channels:mobile': !this.state.mobileAlerts};
    app.client.userPreferencesUpdate(update, (data) => {
      this.setState({
        mobileAlerts: !this.state.mobileAlerts
      });
      if (data.err) {
        alert.show(i18next.t('messages.' + data.err));
      }
    });
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
      dataSource: this.notificationsDataSource.update(id, {
        selected: _.has(elt, 'selected')
          ? !elt.selected
          : true
      })
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

    // call client to tag selected notifications as done and display error
    // message if required
    app.client.notificationDone(selectedIds, false);
  }

  /**
   * If receiving message from server that some notifications as been done
   * @param data
   */
  onDoneNotification (data) {
    clearTimeout(this.timeouts.loadingTagAsDone);

    let state = {loadingTagAsDone: false};

    // remove notifications from blob & close selecting buttons (delete &
    // cancel)
    if (data.notifications && data.notifications.length > 0) {
      state.dataSource = this.notificationsDataSource.markAsDone(data.notifications);
      state.selecting = false;
    }

    this.setState(state);
  }

  onViewedNotification (data) {
    if (!data.notifications) {
      return;
    }

    var ids = [];
    _.each(data.notifications, (notification) => {
      let id = (notification.id)
        ? notification.id
        : notification;
      ids.push(id);
    });

    this.setState({
      dataSource: this.notificationsDataSource.tagAsRead(ids)
    });
  }

  _renderContent (n) {
    return (
      <View style={[{ paddingVertical: 15, paddingLeft: 15, paddingRight: 10, borderBottomWidth: 1, borderBottomColor: '#f1f1f1', borderStyle: 'solid'}, !n.viewed && {borderBottomColor: '#d8deea', backgroundColor: '#E2E8F0'}]}>
        <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1}}>
          {this._renderAvatar(n)}
          <View style={{flexDirection: 'column', justifyContent: 'center', flex: 1, marginLeft: 10}}>
            <Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#586473' }}>{n.message}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginTop: 5 }}>
              <View style={{flex: 1}}>
                {this._renderByUsername(n)}
              </View>
              <Text style={{ fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8' }}>{date.dayMonthTime(n.time)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  _renderAvatar (n) {
    if (n.selected) {
      return (
        <View style={[{ width: 40, height: 40, backgroundColor: '#3498db', flexDirection: 'row', marginRight: 10 }, n.avatarCircle && {borderRadius: 20}]}>
          <Icon
            name='check'
            size={30}
            color='#ecf0f1'
            style={{alignSelf: 'center', marginLeft: 6}}
            />
        </View>
      );
    }

    if (!n.avatar) {
      return null;
    }

    return (
      <Image
        style={[{ width: 40, height: 40, marginRight: 10 }, n.avatarCircle && {borderRadius: 20}]}
        source={{uri: n.avatar}}
        />
    );
  }

  _renderByUsername (n) {
    if (!n.data || !n.data.user || !n.data.user._id) {
      return (<View style={{ flex:1 }}/>);
    }

    return (
      <Username
        prepend={i18next.t('by')}
        user_id={n.data.user._id}
        username={n.username}
        navigator={this.props.navigator}
        style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#586473' }}
        />
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
        dataSource: this.notificationsDataSource.prepend(data.notifications),
        unread: app.user.get('unviewedNotification')
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
        unread: app.user.get('unviewedNotification')
      });
      this._setViewed();
    });
  }

  updateDiscussionsUnviewed () {
    this.setState({
      discussionsUnviewed: app.getUnviewed()
    });
  }

  updateNotificationsUnviewed () {
    this.setState({
      unread: app.user.get('unviewedNotification')
    });
  }

  _setViewed () {
    if (!this.notificationsDataSource.blob) {
      return;
    }
    let ids = [];
    _.each(this.notificationsDataSource.blob, (notification) => {
      if (!notification.viewed) {
        ids.push(notification.id);
      }
    });
    app.client.notificationViewed(ids, false, () => {
      this.setState({
        loadingTagAsRead: false,
        unread: app.user.get('unviewedNotification')
      });
    });
  }
}

module.exports = NotificationsView;

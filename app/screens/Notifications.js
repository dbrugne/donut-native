'use strict';

var React = require('react-native');
var _ = require('underscore');
var app = require('../libs/app');
var navigation = require('../libs/navigation');
var s = require('../styles/style');
var Link = require('../elements/Link');
var LoadingView = require('../elements/Loading');
var alert = require('../libs/alert');
var common = require('@dbrugne/donut-common/mobile');
var date = require('../libs/date');

var {
  StyleSheet,
  View,
  ListView,
  RecyclerViewBackedScrollView,
  Component,
  TouchableHighlight,
  Text,
  Image
  } = React;

var i18next = require('../libs/i18next');

// @todo yls implement swipe to delete a notification
// @todo implement discussion viewed update
// @todo implement notification viewed update (done)
// @todo implement notification pushed
class NotificationsView extends Component {

  constructor(props) {
    super(props);
    this.notificationsDataSource = require('../libs/notificationsDataSource')();
    this.state = {
      loaded: false,
      loadingMore: false,
      error: null,
      unread: 0,
      more: false,
      discussionsUnviewed: app.getUnviewed(),
      dataSource: this.notificationsDataSource.dataSource
    };
  }

  componentDidMount() {
    //app.client.on('notification:new', this.onNewNotification, this);
    //app.client.on('notification:done', this.onDoneNotification, this);
    app.client.notificationRead(null, null, 10, this.onData.bind(this));
  }

  componentWillUnmount() {
    app.client.off(null, null, this);
  }

  onData(response) {
    if (response.err) {
      return this.setState({
        error: true
      });
    }
    this.setState({
      loaded: true,
      dataSource: this.notificationsDataSource.append(response.notifications),
      unread: response.unread,
      more: response.more
    });
  }

  render() {
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
        style={{flex: 1, backgroundColor:'#ffffff'}}
        scrollEnabled={true}
        />
    );
  }

  renderHeader() {
    if (this.state.discussionsUnviewed === 0) {
      return;
    }

    return (
      <Link style={{marginHorizontal: 10, marginVertical:20}}
            underlayColor='transparent'
            onPress={() => navigation.openDrawer()}
            text={i18next.t('notifications.discussion-count', {count: this.state.discussionsUnviewed})}
        >
      </Link>
    );
  }

  renderFooter() {
    if (!this.state.more) {
      return null;
    }

    if (this.state.loadingMore) {
      return (
        <View style={{height:50}}>
          <LoadingView />
        </View>
      );
    }

    return (
      <TouchableHighlight
        underlayColor='#f0f0f0'
        onPress={this.onLoadMore.bind(this)}
        style={{height:50, justifyContent:'center', alignItems:'center'}}
        >
        <Text style={{textAlign:'center'}}>{i18next.t('notifications.load-more')}</Text>
      </TouchableHighlight>
    );
  }

  renderRow(n) {
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

  _renderNotification(n) {
    if (n.onPress) {
      return (
        <TouchableHighlight
          underlayColor='#f0f0f0'
          onPress={n.onPress}
          >
          {this._renderContent(n)}
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  }

  _renderContent(n) {
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

  _renderAvatar(n) {
    if (!n.avatar) {
      return null;
    }

    return (
      <Image style={[{ width: 44, height: 44, borderRadius: 4 }, n.avatarCircle && {borderRadius:22}]}
             source={{uri: n.avatar}}/>
    );
  }

  _renderByUsername(n) {
    if (!n.username) {
      return null;
    }

    return (
      <Text>{i18next.t('by-username', {username: n.username}) }</Text>
    );
  }

  onLoadMore() {
    this.setState({loadingMore: true});

    app.client.notificationRead(null, this.notificationsDataSource.getBottomItemId(), 10, (data) => {
      this.setState({
        loadingMore: false,
        more: data.more,
        unread: data.unread,
        dataSource: this.notificationsDataSource.append(data.notifications)
      });
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 10
  }
});

module.exports = NotificationsView;
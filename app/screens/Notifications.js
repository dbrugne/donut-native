'use strict';

var React = require('react-native');
var _ = require('underscore');
var app = require('../libs/app');
var navigation = require('../libs/navigation');
var s = require('../styles/style');
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
class NotificationsView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      error: null,
      unread: 0,
      more: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  }
  componentDidMount () {
    //app.client.on('notification:new', this.onNewNotification, this);
    //app.client.on('notification:done', this.onDoneNotification, this);
    app.client.notificationRead(null, null, 10, this.onData.bind(this));
  }
  componentWillUnmount () {
    app.client.off(null, null, this);
  }
  onData (response) {
    if (response.err) {
      return this.setState({
        error: true
      });
    }
    this.setState({
      loaded: true,
      dataSource: this.state.dataSource.cloneWithRows(response.notifications),
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
        style={{flex: 1, backgroundColor:'#ffffff'}}
        scrollEnabled={true}
        />
    );

    //return (
    //  <ListView
    //    ref='listView'
    //    style={{flex: 1}}
    //    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
    //    dataSource={this.state.ds}
    //    renderRow={this._renderRow}
    //    renderHeader={this.renderFooter.bind(this)}
    //    renderFooter={this.renderHeader.bind(this)}
    //    onChangeVisibleRows={this.onChangeVisibleRows.bind(this)}
    //    pageSize={4}
    //    />
    //);
  }

  renderRow (n) {
    n.css = '';
    n.href = '';
    n.name = '';
    //n.html = '';
    n.avatarCircle = false;
    if (n.data.room) {
      n.avatar = common.cloudinary.prepare(n.data.room.avatar, 45);
      n.avatarCircle = true;
      n.title = n.data.room.name;
      n.name = n.data.room.name;
      var roomId = (n.data.room._id)
        ? n.data.room._id
        : n.data.room.id;
      n.onPress = _.bind(function() { this.props.navigator.push(navigation.getProfile({type: 'room', id: roomId, identifier: n.name})); }, this);
    } else if (n.data.group) {
      n.avatar = common.cloudinary.prepare(n.data.group.avatar, 45);
      n.avatarCircle = true;
      n.title = n.data.group.name;
      n.name = n.data.group.name;
      var groupId = (n.data.group._id)
        ? n.data.group._id
        : n.data.group.id;
      //n.onPress= () => navigation.switchTo(navigation.getGroup({name: n.name, id: groupId}));
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
      //var roomId = (n.data.room._id)
      //  ? n.data.room._id
      //  : n.data.room.id;
      //n.html += 'data-room-id="' + roomId + '"';
      n.username = null;
    } else if (n.type === 'groupjoinrequest') {
      n.onPress = null;
      n.css += 'open-group-users-allowed';
      //var groupId = (n.data.group._id)
      //  ? n.data.group._id
      //  : n.data.group.id;
      //n.html += 'data-group-id="' + groupId + '"';
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
        <View>
          <TouchableHighlight
            underlayColor= '#f0f0f0'
            onPress={n.onPress}
            >
            <View>
              {this._renderAvatar(n)}
              <Text>{n.message}</Text>
              <Text>{this._renderByUsername(n)}</Text>
              <Text>{date.dayMonthTime(n.time)}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <View>
        {this._renderAvatar(n)}
        <Text>{n.message}</Text>
        <Text>{this._renderByUsername(n)}</Text>
        <Text>{date.dayMonthTime(n.time)}</Text>
      </View>
    );
  }

  _renderAvatar(n) {
    if (!n.avatar) {
      return null;
    }

    return(
      <Image style={[{ width: 44, height: 44, borderRadius: 4 }, n.avatarCircle && {borderRadius:22}]} source={{uri: n.avatar}}/>
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
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 10
  }
});

module.exports = NotificationsView;
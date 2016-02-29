'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet
  } = React;

var Icon = require('react-native-vector-icons/FontAwesome');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var alert = require('../libs/alert');
var i18next = require('../libs/i18next');
var ListItem = require('../components/ListItem');
var s = require('../styles/search');
var date = require('../libs/date');
var userActionSheet = require('../libs/UserActionsSheet');
var navigation = require('../navigation/index');

i18next.addResourceBundle('en', 'ManageInvitations', {
  'invite': 'Invite a user',
  'pending': 'Users pending',
  'allowed': 'Allowed users',
  'not-result': 'No user found',
  'invite-confirmation': 'Not found',
  'invite-disclaimer': 'Did you mean to invite @__username__?'
});

var ManageInvitationsView = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
  propTypes: {
    data: React.PropTypes.object
  },
  getInitialState: function () {
    var dsAllowed = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dsPending = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      allowed: dsAllowed.cloneWithRows([]),
      pending: dsPending.cloneWithRows([]),
      invite: ''
    };
  },
  componentDidMount: function () {
    this._fetchData('pending');
    this._fetchData('allowed');
  },
  _fetchData: function (type) {
    // type : 'pending' or 'allowed'
    var selector = {type: type};
    if (type === 'allowed') {
      selector.selector = {start: 0, length: 6};
    }
    if (this.props.data.type === 'group') {
      app.client.groupUsers(this.props.data.id, selector, (data) => {
        if (data.err) {
          return alert.show(i18next.t('messages.' + data.err));
        }
        var state = {};
        this[type] = data;
        state[type] = this.state[type].cloneWithRows(data.users);
        this.setState(state);
      });
    } else {
      if (type === 'pending') {
        selector.type = 'allowedPending';
      }
      app.client.roomUsers(this.props.data.id, selector, (data) => {
        if (data.err) {
          return alert.show(i18next.t('messages.' + data.err));
        }
        var state = {};
        this[type] = data;
        state[type] = this.state[type].cloneWithRows(data.users);
        this.setState(state);
      });
    }
  },
  render: function () {
    let pendingsTab = null;
    if (this.pending && this.pending.users && this.pending.users.length) {
      pendingsTab = [
        <View key='title-pending' style={{marginLeft: 10, marginTop: 20, marginBottom: 10}}>
          <Text style={{color: '#FC2063', fontSize: 18}}>{i18next.t('ManageInvitations:pending')}</Text>
        </View>,
        <ListView
          key='listview-pending'
          dataSource={this.state.pending}
          renderRow={(rowData) => this._renderPending(rowData)}
          style={{flex: 1}}
          />
      ];
    }
    let allowedsTab = null;
    if (this.allowed && this.allowed.users && this.allowed.users.length) {
      let allowedUsers = (this.allowed && this.allowed.users) ? this.allowed.users : [];
      for (var i = 0; i < allowedUsers.length; i++) {
        allowedUsers[i].isAllowed = true;
      }
      allowedsTab = (
        <ListItem
          onPress={() => navigation.navigate('AllowedUsers', {data: this.props.data, fetchParent: () => this._fetchData('allowed')})}
          text={i18next.t('ManageInvitations:allowed')}
          type='image-list'
          action
          first
          autoCapitalize='none'
          id={this.props.data.id}
          model={app.rooms.iwhere('id', this.props.data.id)}
          parentType={this.props.data.type}
          value={(this.allowed && this.allowed.count) ? this.allowed.count.toString() : '0'}
          imageList={allowedUsers}
          />
      );
    }
    return (
      <ScrollView style={{flex: 1}}>
        <ListItem
          type='input-button'
          first
          value={this.state.invite}
          onChangeText={(text) => this.setState({invite: text})}
          onPress={() => this._inviteUsername()}
          placeholder={i18next.t('ManageInvitations:invite')}
          />
        {pendingsTab}
        <View style={{marginBottom: 40}}/>
        {allowedsTab}
      </ScrollView>
    );
  },
  _renderPending: function (user) {
    var thumbnailUrl = common.cloudinary.prepare(user.avatar, 150);

    return (
      <TouchableHighlight onPress={() => this._openActionSheet(user)} underlayColor='transparent'>
        <View style={[styles.container, s.first]}>
          <View style={[s.thumbnailContainer]}>
            <Image style={{width: 80, height: 80, marginLeft: 10, marginVertical: 10}} source={{uri: thumbnailUrl}}/>
            <View
              style={[
                user.status === 'connecting' && s.statusConnecting,
                user.status === 'offline' && s.statusOffline,
                user.status === 'online' && s.statusOnline,
                styles.status]}
              />
          </View>
          <View style={[styles.rightContainer]}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              {(user.name) ? <Text style={[s.title, {marginBottom: 0, fontSize: 17}]}>{user.name}</Text> : null}
              <Text style={[s.title, (user.name) && {fontWeight: 'normal', color: '#999999'}]}>{'@' + user.username}</Text>
              {
                (user.message)
                  ? <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', marginBottom: 15}}>
                      <Icon
                        name='quote-right'
                        size={14}
                        style={{marginTop: 2, marginRight: 3}}
                        />
                      <Text style={{flex: 1}}>{_.unescape(user.message)}</Text>
                    </View>
                  : null
              }
            </View>
          </View>
          <Text style={{color: '#999', position: 'absolute', bottom: 5, right: 10}}>{date.dayMonthTime(user.date)}</Text>
        </View>
      </TouchableHighlight>
    );
  },
  _openActionSheet: function (user) {
    if (this.props.data.type === 'group') {
      userActionSheet.openGroupActionSheet(this.context.actionSheet(), 'groupInvite', this.props.data.id, user, true, (err) => {
        if (err) {
          return;
        }
        this._fetchData('pending');
      });
    } else {
      var model = app.rooms.iwhere('id', this.props.data.id);
      userActionSheet.openRoomActionSheet(this.context.actionSheet(), 'roomInvite', model, user, (err) => {
        if (err) {
          return;
        }
        this._fetchData('pending');
      });
    }
  },
  _inviteUsername: function () {
    var username = this.state.invite;

    var options = {
      users: true,
      limit: {users: 1}
    };

    app.client.search(username, options, (data) => {
      if (data.err) {
        return;
      }
      if (!data.users || !data.users.list || !data.users.list.length) {
        return alert.show(i18next.t('ManageInvitations:no-result'));
      }
      if (data.users.list[0].username === username) {
        return this._invite(data.users.list[0].user_id);
      }
      alert.askConfirmation(
        i18next.t('ManageInvitations:invite-confirmation'),
        i18next.t('ManageInvitations:invite-disclaimer', {username: data.users.list[0].username}),
        () => this._invite(data.users.list[0].user_id),
        () => {}
      );
    });
  },
  _invite: function (userId) {
    if (this.props.data.type === 'group') {
      app.client.groupAllowedAdd(this.props.data.id, userId, (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
        this._fetchData('pending');
        this._fetchData('allowed');
        this.setState({invite: ''});
      });
    } else {
      app.client.roomInvite(this.props.data.id, userId, (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }
        this._fetchData('pending');
        this._fetchData('allowed');
        this.setState({invite: ''});
      });
    }
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E7ECF3',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightContainer: {
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1,
    paddingRight: 10,
    marginLeft: 10
  },
  status: {
    position: 'absolute',
    top: 80,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#FFF',
    borderWidth: 3
  }
});

module.exports = ManageInvitationsView;

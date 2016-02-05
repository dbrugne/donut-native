'use strict';
var React = require('react-native');
var _ = require('underscore');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var currentUser = require('../models/current-user');
var alert = require('../libs/alert');

var {
  ListView,
  View,
  StyleSheet,
  TouchableHighlight,
  Text
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomUsers', {
  'edit': 'Edit',
  'search': 'search',
  'load-more': 'Load more',
  'no-results': 'No results',
  'users': 'Users',
  'ban': 'Banned',
  'op': 'Moderators',
  'devoice': 'Mute',
  'make-op': 'Make moderator',
  'modal-description-op': 'Are you sure you want to make @__username__ moderator?',
  'make-deop': 'Remove from moderator',
  'modal-description-deop': 'Are you sure you want to remove @__username__ from moderators?',
  'make-voice': 'Unmute',
  'modal-description-voice': 'Are you sure you want to unmute @__username__?',
  'make-devoice': 'Mute',
  'modal-description-devoice': 'Are you sure you want to mute @__username__?',
  'make-ban': 'Kick and ban',
  'modal-description-ban': 'Are you sure you want to ban @__username__?',
  'make-deban': 'Unban',
  'modal-description-deban': 'Are you sure you want to unban @__username__?',
  'make-kick': 'Kick',
  'modal-description-kick': 'Are you sure you want to kick @__username__?',
  'title': 'Actions on this user',
  'chat': 'Chat one-to-one',
  'cancel': 'Cancel',
  'view-profile': 'View profile'
}, true, true);

var RoomUsersView = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
  propTypes: {
    navigator: React.PropTypes.object,
    id: React.PropTypes.string.isRequired
  },
  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.username !== r2.username});
    this.usersList = [];
    this.searchString = '';
    this.type = 'users';
    this.currentNumberCharged = 0;
    return {
      loaded: false,
      dataSource: ds.cloneWithRows([]),
      findValue: '',
      more: false,
      is_op: false,
      is_owner: false
    };
  },

  fetchData: function () {
    this.setState({loaded: false});
    app.client.roomUsers(this.props.id, {type: this.type, searchString: this.searchString, selector: {start: this.currentNumberCharged, length: 10}}, (response) => {
      if (response.err) {
        return;
      }

      var numberUsersReceive = 0;
      if (response.users && response.users.length) {
        numberUsersReceive = response.users.length;
      }
      this.currentNumberCharged = this.currentNumberCharged + numberUsersReceive;
      this.usersList = this.usersList.concat(response.users);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.usersList),
        loaded: true,
        more: (response.count > this.usersList.length)
      });
    });
  },

  componentDidMount: function () {
    app.client.roomRead(this.props.id, {}, (response) => {
      if (response.err) {
        return;
      }
      this.setState({
        is_op: response.is_op,
        is_owner: response.is_owner
      });
      this.fetchData();
    });
  },

  render: function () {
    return (
      <View style={styles.container}>
        <View>
          <ListItem type='input'
                    first
                    last
                    autoCapitalize='none'
                    placeholder={i18next.t('RoomUsers:search')}
                    onChangeText={(text) => this.setState({findValue: text})}
                    value={this.state.findValue}
                    onSubmitEditing={(event) => this._onSearch(event.nativeEvent.text)}
                    iconRight='search'
            />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={() => this._changeType('users')}
                              underlayColor= '#DDD'
                              style={[styles.button, this.type === 'users' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('RoomUsers:users')}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this._changeType('ban')}
                              underlayColor= '#DDD'
                              style={[styles.button, this.type === 'ban' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('RoomUsers:ban')}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this._changeType('op')}
                              underlayColor= '#DDD'
                              style={[styles.button, this.type === 'op' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('RoomUsers:op')}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this._changeType('devoice')}
                              underlayColor= '#DDD'
                              style={[styles.button, this.type === 'devoice' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('RoomUsers:devoice')}</Text>
          </TouchableHighlight>
        </View>

        <ListView
          ref='listViewUsers'
          dataSource={this.state.dataSource}
          renderRow={(e) => this._renderElement(e)}
          style={{flex: 1}}
          renderFooter={() => this._renderLoadMore()}
          />
      </View>
    );
  },

  _changeType: function (type) {
    if (this.type === type) {
      return;
    }

    this.type = type;
    this.usersList = [];
    this.currentNumberCharged = 0;
    this.setState({dataSource: this.state.dataSource.cloneWithRows([])});
    this.fetchData();
  },

  _renderElement: function (user) {
    // No specific actions possible on this user
    if (!this.state.is_owner && !this.state.is_op && !currentUser.isAdmin()) {
      return (
        <Card
          onPress={() => navigation.navigate('Profile', {type: 'user', id: user.user_id, identifier: '@' + user.username})}
          image={user.avatar}
          type='user'
          identifier={'@' + user.username}
          realname={user.realname}
          bio={user.bio}
          status={user.status}
          op={user.isOp}
          owner={user.isOwner}
          devoiced={user.isDevoiced}
          banned={user.isBanned}
          />
      );
    }

    return (
      <Card
        onPress={() => this._onOpenActionSheet(user)}
        image={user.avatar}
        type='user'
        identifier={'@' + user.username}
        realname={user.realname}
        bio={user.bio}
        status={user.status}
        op={user.isOp}
        owner={user.isOwner}
        devoiced={user.isDevoiced}
        banned={user.isBanned}
        />
    );
  },
  _renderLoadMore: function () {
    if (!this.state.loaded) {
      return (<LoadingView style={styles.loadMore} />);
    } else if (this.state.more) {
      return (
        <TouchableHighlight onPress={() => this.fetchData()}
                            underlayColor= '#DDD'
          >
          <View style={styles.loadMore}>
            <Text style={{color: '#333', textAlign: 'center'}}>{i18next.t('RoomUsers:load-more')}</Text>
          </View>
        </TouchableHighlight>
      );
    } else if (!this.usersList.length) {
      return (<View style={styles.loadMore}><Text style={{color: '#333', textAlign: 'center'}}>{i18next.t('RoomUsers:no-results')}</Text></View>);
    } else {
      return null;
    }
  },

  _onSearch: function (text) {
    this.searchString = text;
    this.currentNumberCharged = 0;
    this.usersList = [];
    this.setState({dataSource: this.state.dataSource.cloneWithRows([])});
    this.fetchData();
  },

  _getOptionsForActionSheet (user) {
    var options = [
      {
        text: i18next.t('RoomUsers:view-profile'),
        onPress: () => navigation.navigate('Profile', {type: 'user', id: user.user_id, identifier: '@' + user.username})
      },
      {
        text: i18next.t('RoomUsers:chat'),
        onPress: () => app.trigger('joinUser', user.user_id)
      }
    ];

    // if it's owner no more actions than chat and see profile
    if (user.isOwner) {
      options.push({
        text: i18next.t('RoomUsers:cancel'),
        onPress: () => {},
        isCancelButton: true
      });
      return options;
    }

    // op / deop
    options.push({
      text: (user.isOp)
        ? i18next.t('RoomUsers:make-deop')
        : i18next.t('RoomUsers:make-op'),
      onPress: () => (user.isOp)
        ? this._onDeop(user)
        : this._onOp(user)
    });

    // devoice / voice
    options.push({
      text: (user.isDevoiced)
        ? i18next.t('RoomUsers:make-voice')
        : i18next.t('RoomUsers:make-devoice'),
      onPress: () => (user.isDevoiced)
        ? this._onVoice(user)
        : this._onDevoice(user)
    });

    // kick
    options.push({
      text: i18next.t('RoomUsers:make-kick'),
      onPress: () => this._onKick(user)
    });

    // ban / unban
    options.push({
      text: (user.isBanned)
        ? i18next.t('RoomUsers:make-deban')
        : i18next.t('RoomUsers:make-ban'),
      onPress: () => (user.isBanned)
        ? this._onUnban(user)
        : this._onBan(user),
      isDestructiveButton: true
    });

    options.push({
      text: i18next.t('RoomUsers:cancel'),
      onPress: () => {},
      isCancelButton: true
    });

    return options;
  },

  _onOpenActionSheet (user) {
    var options = this._getOptionsForActionSheet(user);
    let destructiveButtonIndex = null;
    let cancelButtonIndex = null;
    for (var i = 0; i < options.length; i++) {
      if (options[i].isDestructiveButton) {
        destructiveButtonIndex = i;
      }
      if (options[i].isCancelButton) {
        cancelButtonIndex = i;
      }
    }
    var optionsTitles = _.map(options, 'text');
    this.context.actionSheet().showActionSheetWithOptions({
      options: optionsTitles,
      cancelButtonIndex,
      destructiveButtonIndex
    },
      (buttonIndex) => {
        options[buttonIndex].onPress();
      });
  },

  _onDeop: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-deop'),
      i18next.t('RoomUsers:modal-description-deop', {username: user.username}),
      () => {
        app.client.roomDeop(this.props.id, user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          user.isOp = false;
        });
      },
      () => {}
    );
  },
  _onOp: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-op'),
      i18next.t('RoomUsers:modal-description-op', {username: user.username}),
      () => {
        app.client.roomOp(this.props.id, user.user_id, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          user.isOp = true;
        });
      },
      () => {}
    );
  },
  _onDevoice: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-devoice'),
      i18next.t('RoomUsers:modal-description-devoice', {username: user.username}),
      () => {
        app.client.roomDevoice(this.props.id, user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          user.isDevoiced = true;
        });
      },
      () => {}
    );
  },
  _onVoice: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-voice'),
      i18next.t('RoomUsers:modal-description-voice', {username: user.username}),
      () => {
        app.client.roomVoice(this.props.id, user.user_id, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          user.isDevoiced = false;
        });
      },
      () => {}
    );
  },
  _onUnban: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-deban'),
      i18next.t('RoomUsers:modal-description-deban', {username: user.username}),
      () => {
        app.client.roomDeban(this.props.id, user.user_id, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          user.isBanned = false;
        });
      },
      () => {}
    );
  },
  _onBan: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-ban'),
      i18next.t('RoomUsers:modal-description-ban', {username: user.username}),
      () => {
        app.client.roomBan(this.props.id, user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          user.isBanned = true;
        });
      },
      () => {}
    );
  },
  _onKick: function (user) {
    alert.askConfirmation(
      i18next.t('RoomUsers:make-kick'),
      i18next.t('RoomUsers:modal-description-kick', {username: user.username}),
      () => {
        app.client.roomKick(this.props.id, user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
        });
      },
      () => {}
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  loadMore: {
    height: 40,
    backgroundColor: '#f5f8fa',
    justifyContent: 'center'
  },
  buttonContainer: {
    borderTopWidth: 3,
    borderStyle: 'solid',
    borderColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    height: 40,
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3498db'
  },
  buttonActive: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: '#3498db'
  },
  textButton: {
    padding: 10,
    textAlign: 'center',
    color: '#333'
  }
});

module.exports = RoomUsersView;

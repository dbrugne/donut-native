'use strict';
var React = require('react-native');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var currentUser = require('../models/current-user');
var userActionSheet = require('../libs/UserActionsSheet');

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
    this.model = app.rooms.iwhere('id', this.props.id);
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
    let types = null;
    if (this.state.is_op || this.state.is_owner || currentUser.isAdmin()) {
      types = [
        <TouchableHighlight onPress={() => this._changeType('devoice')}
                            underlayColor= '#DDD'
                            key='devoice'
                            style={[styles.button, this.type === 'devoice' && styles.buttonActive]}>
          <Text style={styles.textButton}>{i18next.t('RoomUsers:devoice')}</Text>
        </TouchableHighlight>,
        <TouchableHighlight onPress={() => this._changeType('ban')}
                            underlayColor= '#DDD'
                            key='ban'
                            style={[styles.button, this.type === 'ban' && styles.buttonActive]}>
          <Text style={styles.textButton}>{i18next.t('RoomUsers:ban')}</Text>
        </TouchableHighlight>
      ];
    }
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
          <TouchableHighlight onPress={() => this._changeType('op')}
                              underlayColor= '#DDD'
                              style={[styles.button, this.type === 'op' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('RoomUsers:op')}</Text>
          </TouchableHighlight>
          {types}
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

  _onOpenActionSheet (user) {
    userActionSheet.openRoomActionSheet(this.context.actionSheet(), 'roomUsers', this.model, user);
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

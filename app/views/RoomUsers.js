'use strict';
var React = require('react-native');
var _ = require('underscore');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var currentUser = require('../models/current-user');

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
  'devoice': 'Mute'
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
    var users = [];
    app.client.roomUsers(this.props.id, {type: this.type, searchString: this.searchString, selector: {start: this.currentNumberCharged, length: 10}}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {
        return u.username.toLowerCase();
      });
      users = _.sortBy(users, (u) => {
        return u.status === 'offline';
      });
      this.usersList = this.usersList.concat(users);
      this.currentNumberCharged = this.currentNumberCharged + users.length;
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
        onPress={() => this._onOpenActionSheet(this.props.id, user)}
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
  _onOpenActionSheet (roomId, user) {
    // @todo dbrugne
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    let options = ['View profile', 'Chat', 'Kick', 'Kick and ban', 'Devoice', 'Cancel'];
    let destructiveButtonIndex = 3;
    let cancelButtonIndex = 5;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    },
      (buttonIndex) => {
        console.log('press on ', buttonIndex);
      });
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
    var users = [];
    this.searchString = text;
    this.setState({loaded: false});
    app.client.roomUsers(this.props.id, {type: this.type, searchString: text, selector: {start: 0, length: 10}}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {
        return u.username.toLowerCase();
      });
      users = _.sortBy(users, (u) => {
        return u.status === 'offline';
      });
      this.usersList = users;
      this.currentNumberCharged = users.length;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(users),
        loaded: true,
        more: (response.count > this.usersList.length)
      });
    });
  },

  _refreshData: function () {
    var users = [];
    this.searchString = '';
    this.type = 'users';
    this.setState({loaded: false, dataSource: this.state.dataSource.cloneWithRows([])});
    app.client.roomUsers(this.props.id, {type: this.type, selector: {start: 0, length: 10}}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {
        return u.username.toLowerCase();
      });
      this.usersList = users;
      this.currentNumberCharged = users.length;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(users),
        loaded: true,
        more: (response.count > this.usersList.length)
      });
    });
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

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
  'no-results': 'No results'
}, true, true);

var RoomUsersView = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    id: React.PropTypes.string.isRequired
  },
  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.username !== r2.username});
    this.usersList = [];
    this.searchString = '';
    return {
      loaded: false,
      dataSource: ds.cloneWithRows([]),
      findValue: '',
      currentNumberCharged: 0,
      more: false
    };
  },

  fetchData: function () {
    this.setState({loaded: false});
    var users = [];
    app.client.roomUsers(this.props.id, {type: 'all', searchString: this.searchString, selector: {start: this.state.currentNumberCharged, length: 10}}, (response) => {
      this.isOwner = _.find(response.users, (u) => {
        return (u.isOwner && u.user_id === currentUser.getId());
      });
      this.isOp = _.find(response.users, (u) => {
        return (u.isOp && u.user_id === currentUser.getId());
      });
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
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.usersList),
        loaded: true,
        currentNumberCharged: this.state.currentNumberCharged + users.length,
        more: (response.count > this.usersList.length)
      });
    });
  },

  componentDidMount: function () {
    this.fetchData();
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

  _renderElement: function (user) {
    // No specific actions possible on this user
    if (!this.isOwner && !this.isOp && !currentUser.isAdmin()) {
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
        onPress={() => navigation.navigate('Profile', {type: 'user', id: user.user_id, identifier: '@' + user.username})}
        image={user.avatar}
        type='user'
        identifier={'@' + user.username}
        realname={user.realname}
        bio={user.bio}
        status={user.status}
        onEdit={() => navigation.navigate('RoomUser', this.props.id, user, () => this._refreshData())}
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
    var users = [];
    this.searchString = text;
    this.setState({loaded: false});
    app.client.roomUsers(this.props.id, {type: 'all', searchString: text, selector: {start: 0, length: 10}}, (response) => {
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
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(users),
        loaded: true,
        currentNumberCharged: users.length,
        more: (response.count > this.usersList.length)
      });
    });
  },

  _refreshData: function () {
    var users = [];
    this.searchString = '';
    this.setState({loaded: false, dataSource: this.state.dataSource.cloneWithRows([])});
    app.client.roomUsers(this.props.id, {type: 'all', selector: {start: 0, length: 10}}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {
        return u.username.toLowerCase();
      });
      this.usersList = users;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(users),
        loaded: true,
        currentNumberCharged: users.length,
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
  }
});

module.exports = RoomUsersView;

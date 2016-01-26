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
  StyleSheet
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomUsers', {
  'edit': 'Edit',
  'search': 'search'
}, true, true);

var RoomUsersView = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    id: React.PropTypes.string.isRequired
  },
  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.username !== r2.username});
    return {
      loaded: false,
      dataSource: ds.cloneWithRows([]),
      findValue: ''
    };
  },

  fetchData: function () {
    this.setState({loaded: false});
    var users = [];
    app.client.roomUsers(this.props.id, {type: 'users'}, (response) => {
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
      this.setState({dataSource: this.state.dataSource.cloneWithRows(users), loaded: true});
    });
  },

  componentDidMount: function () {
    this.fetchData();
  },

  render: function () {
    if (!this.state.loaded) {
      return (<LoadingView />);
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
                    iconRight='fontawesome|search'
            />
        </View>

        <ListView
          ref='listViewUsers'
          dataSource={this.state.dataSource}
          renderRow={(e) => this._renderElement(e)}
          style={{flex: 1}}
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
        onEdit={() => navigation.navigate('RoomUser', this.props.id, user, () => this.fetchData())}
        op={user.isOp}
        owner={user.isOwner}
        devoiced={user.isDevoiced}
        />
    );
  },

  _onSearch: function (text) {
    var users = [];
    app.client.roomUsers(this.props.id, {type: 'users', searchString: text}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {
        return u.username.toLowerCase();
      });
      users = _.sortBy(users, (u) => {
        return u.status === 'offline';
      });
      this.setState({dataSource: this.state.dataSource.cloneWithRows(users)});
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = RoomUsersView;

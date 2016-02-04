'use strict';
var React = require('react-native');
var navigation = require('../navigation/index');
var Card = require('../components/Card');
var LoadingView = require('../components/Loading');
var app = require('../libs/app');
var alert = require('../libs/alert');
var currentUser = require('../models/current-user');

var {
  ListView,
  View
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupUsers', {
  'edit': 'Edit',
  'search': 'search'
}, true, true);

var GroupUsersView = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loading: true
    };
  },

  componentDidMount: function () {
    this.fetchData();
  },

  fetchData: function () {
    this.setState({loading: true});
    app.client.groupRead(this.props.data.group_id, {users: true}, (response) => {
      this.setState({loading: false});
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      this.setState({dataSource: this.state.dataSource.cloneWithRows(response.members)});
    });
  },

  render: function () {
    if (this.state.loading) {
      return (<LoadingView/>);
    }
    return (
      <View style={{flex: 1}}>
        <ListView
          ref='listViewUsers'
          dataSource={this.state.dataSource}
          renderRow={(user) => this._renderElement(user)}
          style={{flex: 1}}
          />
      </View>
    );
  },

  _renderElement: function (user) {
    if (!this.props.data.is_op && !this.props.data.is_owner && !currentUser.isAdmin()) {
      return (
        <Card
          onPress={() => navigation.navigate('Profile', {type: 'user', id: user.user_id, identifier: '@' + user.username})}
          image={user.avatar}
          type='user'
          identifier={'@' + user.username}
          realname={user.realname}
          bio={user.bio}
          status={user.status}
          key={user.user_id}
          op={user.is_op}
          owner={user.is_owner}
          />
      );
    }

    return (
      <Card
        onPress={() => navigation.navigate('Profile', {type: 'user', id: user.user_id, identifier: '@' + user.username})}
        image={user.avatar}
        type='user'
        identifier={'@' + user.username}
        onEdit={() => navigation.navigate('GroupUser', this.props.data.group_id, user, () => this.fetchData())}
        op={user.is_op}
        owner={user.is_owner}
        status={user.status}
        key={user.user_id}
        />
    );
  }
});

module.exports = GroupUsersView;


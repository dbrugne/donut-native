'use strict';
var React = require('react-native');
var Card = require('../components/Card');
var LoadingView = require('../components/Loading');
var app = require('../libs/app');
var alert = require('../libs/alert');
var currentUser = require('../models/current-user');
var userActionSheet = require('../libs/UserActionsSheet');

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
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
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
    return (
      <Card
        onPress={() => this._onOpenActionSheet(user, this.props.data.is_op || this.props.data.is_owner || currentUser.isAdmin())}
        image={user.avatar}
        type='user'
        identifier={'@' + user.username}
        realname={user.realname}
        bio={user.bio}
        op={user.is_op}
        owner={user.is_owner}
        status={user.status}
        key={user.user_id}
        />
    );
  },

  _onOpenActionSheet: function (user, adminOwnerOrOp) {
    userActionSheet.openGroupActionSheet(this.context.actionSheet(), 'groupUsers', this.props.data.group_id, user, adminOwnerOrOp);
  }
});

module.exports = GroupUsersView;


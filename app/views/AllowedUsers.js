'use strict';

var React = require('react-native');
var {
  ListView
  } = React;

var _ = require('underscore');
var app = require('../libs/app');
var Card = require('../components/Card');
var LoadingView = require('../components/Loading');
var alert = require('../libs/alert');
var userActionSheet = require('../libs/UserActionsSheet');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'AllowedUsers', {
});

var AllowedUsersView = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
  propTypes: {
    data: React.PropTypes.object,
    fetchParent: React.PropTypes.func
  },
  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      loaded: false,
      users: ds.cloneWithRows([])
    };
  },
  componentDidMount: function () {
    this._fetchData();
  },
  _fetchData: function () {
    this.setState({loaded: false});
    if (this.props.data.type === 'group') {
      app.client.groupUsers(this.props.data.id, {type: 'allowed'}, (data) => {
        if (data.err) {
          return alert.show(i18next.t('messages.' + data.err));
        }
        this.setState({loaded: true, users: this.state.users.cloneWithRows(data.users)});
      });
    } else {
      app.client.roomUsers(this.props.data.id, {type: 'allowed'}, (data) => {
        if (data.err) {
          return alert.show(i18next.t('messages.' + data.err));
        }
        this.setState({loaded: true, users: this.state.users.cloneWithRows(data.users)});
      });
    }
  },
  render: function () {
    if (!this.state.loaded) {
      return (<LoadingView />);
    }

    return (
      <ListView style={{flex: 1}}
                dataSource={this.state.users}
                renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, rowID)}
        />
    );
  },
  _renderRow: function (user, rowID) {
    return (
      <Card
        type='user'
        onPress={() => this._openActionSheet(user)}
        first={rowID === 0}
        realname={user.realname}
        image={user.avatar}
        identifier={'@' + user.username}
        bio={user.bio}
        status={user.status}
        op={user.isOp}
        />
    );
  },
  _openActionSheet: function (user) {
    var userData = _.extend(user, {isAllowed: true});
    if (this.props.data.type === 'group') {
      userActionSheet.openGroupActionSheet(this.context.actionSheet(), 'groupInvite', this.props.data.id, userData, true, (err) => {
        if (!err) {
          this.props.fetchParent();
          this._fetchData();
        }
      });
    } else {
      var model = app.rooms.iwhere('id', this.props.data.id);
      userActionSheet.openRoomActionSheet(this.context.actionSheet(), 'roomInvite', model, user, (err) => {
        if (!err) {
          this.props.fetchParent();
          this._fetchData();
        }
      });
    }
  }
});

module.exports = AllowedUsersView;

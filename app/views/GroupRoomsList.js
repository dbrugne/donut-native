'use strict';

var React = require('react-native');
var {
  View,
  ListView
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupRooms', {
  '': ''
}, true, true);

var GroupRoomsListView = React.createClass({
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
  componentDidMount () {
    if (this.props.data.is_banned) {
      return this.props.navigator.popToTop();
    }
    this.fetchData();
  },
  fetchData: function () {
    this.setState({loading: true});
    app.client.groupRead(this.props.data.group_id, {rooms: true}, (response) => {
      this.setState({loading: false});
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      var rooms = [];
      _.each(response.rooms, _.bind(function (room) {
        if (room.mode === 'public' || (room.mode === 'private' && (this.props.data.is_owner || this.props.data.is_member))) {
          // default room of this group
          if (response.default === room.id) {
            room.is_default = true;
          }
          rooms.push(room);
        }
      }, this));
      this.setState({dataSource: this.state.dataSource.cloneWithRows(rooms)});
    });
  },
  render () {
    if (this.state.loading) {
      return (<LoadingView/>);
    }

    return (
      <View style={{flex: 1}}>
        <ListView
          ref='listViewRooms'
          dataSource={this.state.dataSource}
          renderRow={(room) => this._renderElement(room)}
          style={{alignSelf: 'stretch'}}
          />
      </View>
    );
  },
  _renderElement (room) {
    // @todo also add group_owner & group_op
    if (!this.props.data.is_op && !this.props.data.is_owner && !currentUser.isAdmin()) {
      return (
        <Card
          onPress={() => navigation.navigate('Profile', {type: 'room', id: room.room_id, identifier: room.identifier})}
          image={room.avatar}
          type='room'
          key={room.room_id}
          identifier={room.identifier}
          description={room.description}
          mode={(!room.mode || room.mode === 'public') ? 'public' : (room.allow_group_member) ? 'member' : 'private'}
          />
      );
    }

    return (
      <Card
        onPress={() => navigation.navigate('Profile', {type: 'room', id: room.room_id, identifier: room.identifier})}
        image={room.avatar}
        type='room'
        key={room.room_id}
        identifier={room.identifier}
        description={room.description}
        mode={(!room.mode || room.mode === 'public') ? 'public' : (room.allow_group_member) ? 'member' : 'private'}
        onEdit={() => navigation.navigate('GroupRoom', this.props.data, room)}
      />
    );
  }
});

module.exports = GroupRoomsListView;

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  ScrollView,
  Text
  } = React;

var _ = require('underscore');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var LoadingView = require('../components/Loading');
var ListItem = require('../components/ListItem');
var Card = require('../components/Card');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var GroupHeader = require('./GroupHeader');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupRoomsList', {
  'discussion-list': 'DISCUSSION LIST',
  'not-member': 'You can only see public discussions until you become a member'
});

var GroupRoomsListView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loading: true,
      data: null
    };
  },
  componentDidMount () {
    if (this.props.model.get('is_banned')) {
      return this.props.navigator.popToTop();
    }
    this.fetchData();
  },
  fetchData: function () {
    this.setState({loading: true});
    app.client.groupRead(this.props.model.get('group_id'), {rooms: true}, (response) => {
      this.setState({loading: false});
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      var rooms = [];
      _.each(response.rooms, _.bind(function (room) {
        if (room.mode === 'public' || (room.mode === 'private' && (this.props.model.get('is_owner') || this.props.model.get('is_member')))) {
          // default room of this group
          if (response.default === room.id) {
            room.is_default = true;
          }
          rooms.push(room);
        }
      }, this));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rooms),
        data: response
      });
    });
  },
  render () {
    if (this.state.loading) {
      return (<LoadingView/>);
    }

    return (
      <ScrollView style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
        <GroupHeader {...this.props} small/>
        <View style={{ marginTop: 40 }}/>
        <ListItem type='title' title={i18next.t('GroupRoomsList:discussion-list')}/>
        <View style={{ marginTop: 20 }}/>
        {this._renderNotMemberDisclaimer()}
        <ListView
          ref='listViewRooms'
          dataSource={this.state.dataSource}
          renderRow={(room) => this._renderElement(room)}
          style={{alignSelf: 'stretch'}}
          />
      </ScrollView>
    );
  },
  _renderNotMemberDisclaimer: function () {
    if (!this.state.data || this.state.data.is_member) {
      return null;
    }

    return (
      <View style={{ alignSelf: 'stretch', marginBottom: 20, marginHorizontal: 20 }}>
        <Text style={{ fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{i18next.t('GroupRoomsList:not-member')}</Text>
      </View>
    );
  },
  _renderElement (room, sectionID, rowID) {
    if (!this.props.model.get('is_op') && !this.props.model.get('is_owner') && !room.is_op && !room.is_owner && !currentUser.isAdmin()) {
      return (
        <Card
          onPress={() => navigation.navigate('Profile', {type: 'room', id: room.room_id, identifier: room.identifier})}
          image={room.avatar}
          type='room'
          key={room.room_id}
          first={rowID === '0'}
          count={room.users}
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
        count={room.users}
        identifier={room.identifier}
        description={room.description}
        mode={(!room.mode || room.mode === 'public') ? 'public' : (room.allow_group_member) ? 'member' : 'private'}
        onEdit={() => navigation.navigate('GroupRoom', this.props.model.toJSON(), room)}
        />
    );
  }
});

module.exports = GroupRoomsListView;

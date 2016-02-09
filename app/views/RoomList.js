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
i18next.addResourceBundle('en', 'RoomList', {
  '': ''
});

var RoomListView = React.createClass({
  getInitialState: function () {
    return {
      loading: true,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2})
    };
  },
  componentDidMount () {
    this.fetchData();
  },
  fetchData: function () {
    this.setState({loading: true});
    app.client.home((response) => {
      this.setState({loading: false});
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      var rooms = [];
      _.each(response.rooms.list, function(elt){
        if (elt.type === 'room') {
          rooms.push(elt);
        }
      });

      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(rooms)
      });
    });
  },
  render () {
    if (this.state.loading) {
      return (<LoadingView/>);
    }

    return (
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(room) => this._renderElement(room)}
          style={{alignSelf: 'stretch'}}
          />
      </View>
    );
  },
  _renderElement (room) {
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
});

module.exports = RoomListView;

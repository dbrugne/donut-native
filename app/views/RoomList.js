'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  ScrollView,
  Text
} = React;

var _ = require('underscore');
var s = require('../styles/style');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomList', {
  'disclaimer': 'Join a discussion about anything you are interested in'
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
      <ScrollView>

        <View style={s.centeredBlock}>
          <Text style={s.centeredBlockText}>{i18next.t('RoomList:disclaimer')}</Text>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={(room) => this._renderElement(room)}
          style={{alignSelf: 'stretch'}}
          scrollEnabled={false}
          />
      </ScrollView>
    );
  },
  _renderElement (room, sectionID, rowID) {
    return (
      <Card
        onPress={() => navigation.navigate('Profile', {type: 'room', id: room.room_id, identifier: room.identifier})}
        image={room.avatar}
        type='room'
        count={room.users}
        key={room.room_id}
        first={rowID === '0'}
        identifier={room.identifier}
        description={room.description}
        mode={(!room.mode || room.mode === 'public') ? 'public' : (room.allow_group_member) ? 'member' : 'private'}
        />
    );
  }
});

module.exports = RoomListView;

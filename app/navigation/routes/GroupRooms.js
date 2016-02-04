'use strict';

var React = require('react-native');

module.exports = function (data) {
  return {
    id: 'group-rooms-' + data.room_id,
    renderScene: function (navigator) {
      let GroupRoomsList = require('../../views/GroupRoomsList');
      return (<GroupRoomsList navigator={navigator} data={data} />);
    },
    getTitle () {
      return data.name || 'rooms';
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

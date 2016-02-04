'use strict';

var React = require('react-native');

module.exports = function (group) {
  return {
    id: 'group-rooms-' + group.group_id,
    renderScene: function (navigator) {
      let GroupRoomsList = require('../../views/GroupRoomsList');
      return (<GroupRoomsList navigator={navigator} group={group} />);
    },
    getTitle () {
      return group.name || 'rooms';
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

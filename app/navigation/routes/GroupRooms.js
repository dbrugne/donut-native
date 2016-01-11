'use strict';

var React = require('react-native');

module.exports = function (element) {
  return {
    id: 'group-rooms-' + element.id,
    renderScene: function (navigator) {
      let GroupRoomsList = require('../../views/GroupRoomsList');
      return (<GroupRoomsList navigator={navigator} id={element.id} user={element.user} />);
    },
    getTitle () {
      return element.name || 'rooms';
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

'use strict';

var React = require('react-native');

module.exports = function (model) {
  return {
    id: 'group-rooms-' + model.get('group_id'),
    renderScene: function (navigator) {
      let GroupRoomsList = require('../../views/GroupRoomsList');
      return (<GroupRoomsList navigator={navigator} model={model} />);
    },
    getTitle () {
      return model.get('name') || 'rooms';
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

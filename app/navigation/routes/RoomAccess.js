var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (room) {
  return {
    id: 'room-access-' + room.get('id'),
    renderScene: function (navigator) {
      let RoomAccess = require('../../views/RoomAccess');
      return <RoomAccess navigator={navigator} room={room} />;
    },
    getTitle () {
      return i18next.t('navigation.room-access', {roomname: room.get('identifier')});
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

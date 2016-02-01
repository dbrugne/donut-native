var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (roomId, saveRoomData) {
  return {
    renderScene: function (navigator) {
      let RoomEditDescription = require('../../views/RoomEditDescription');
      return <RoomEditDescription navigator={navigator} roomId={roomId} saveRoomData={saveRoomData}/>;
    },
    getTitle () {
      return i18next.t('navigation.room-edit-description');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

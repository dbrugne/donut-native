var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (roomId, saveRoomData) {
  return {
    renderScene: function (navigator) {
      let RoomEditDisclaimer = require('../../views/RoomEditDisclaimer');
      return <RoomEditDisclaimer navigator={navigator} roomId={roomId} saveRoomData={saveRoomData}/>;
    },
    getTitle () {
      return i18next.t('navigation.room-edit-disclaimer');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

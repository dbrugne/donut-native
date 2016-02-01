var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (roomId, saveRoomData) {
  return {
    renderScene: function (navigator) {
      let RoomEditWebsite = require('../../views/RoomEditWebsite');
      return <RoomEditWebsite navigator={navigator} roomId={roomId} saveRoomData={saveRoomData}/>;
    },
    getTitle () {
      return i18next.t('navigation.room-edit-website');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

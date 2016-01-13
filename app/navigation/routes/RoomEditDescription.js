var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model, saveRoomData) {
  return {
    renderScene: function (navigator) {
      let RoomEditDescription = require('../../views/RoomEditDescription');
      return <RoomEditDescription navigator={navigator} model={model} saveRoomData={saveRoomData}/>;
    },
    getTitle () {
      return i18next.t('navigation.room-edit-description');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

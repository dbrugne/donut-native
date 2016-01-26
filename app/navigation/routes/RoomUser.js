var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (roomId, user, parentCallback) {
  return {
    renderScene: function (navigator) {
      let RoomUsers = require('../../views/RoomUser');
      return <RoomUsers navigator={navigator} user={user} roomId={roomId} parentCallback={parentCallback}/>;
    },
    getTitle () {
      return i18next.t('navigation.manage-user');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

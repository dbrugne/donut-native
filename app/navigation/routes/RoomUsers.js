var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (id) {
  return {
    id: 'room-users-' + id,
    renderScene: function (navigator) {
      let RoomUsers = require('../../views/RoomUsers');
      return <RoomUsers navigator={navigator} id={id} />;
    },
    getTitle () {
      return i18next.t('navigation.room-users');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

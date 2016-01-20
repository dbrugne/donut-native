var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    id: 'room-users-' + data.id,
    renderScene: function (navigator) {
      let RoomUsers = require('../../views/RoomUsers');
      return <RoomUsers navigator={navigator} data={data} />;
    },
    getTitle () {
      return i18next.t('navigation.room-users');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

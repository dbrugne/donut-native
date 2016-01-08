var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'room-users-' + model.get('id'),
    renderScene: function (navigator) {
      let RoomUsers = require('../../views/RoomUsers');
      return <RoomUsers navigator={navigator} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.room-users');
    }
  };
};

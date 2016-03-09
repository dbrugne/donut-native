var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'room-preferences-' + model.get('id'),
    renderScene: function (navigator) {
      let RoomPreferences = require('../../views/RoomPreferences');
      return <RoomPreferences navigator={navigator} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.room-preferences');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

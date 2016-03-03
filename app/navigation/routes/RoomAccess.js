var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'room-access-' + model.get('id'),
    renderScene: function (navigator) {
      let RoomAccess = require('../../views/RoomAccess');
      return <RoomAccess navigator={navigator} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.room-access', {roomname: model.get('identifier')});
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

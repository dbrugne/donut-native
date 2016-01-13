var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'room-edit-' + model.get('id'),
    renderScene: function (navigator) {
      let RoomEdit = require('../../views/RoomEdit');
      return <RoomEdit navigator={navigator} model={model}/>;
    },
    getTitle () {
      return i18next.t('navigation.room-edit');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};


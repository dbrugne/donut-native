var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    id: 'room-edit-' + data.id,
    renderScene: function (navigator) {
      let RoomEdit = require('../../views/RoomEdit');
      return <RoomEdit navigator={navigator} data={data}/>;
    },
    getTitle () {
      return i18next.t('navigation.room-edit');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};


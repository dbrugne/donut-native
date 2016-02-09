var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    renderScene: function (navigator) {
      let RoomList = require('../../views/RoomList');
      return <RoomList navigator={navigator} />;
    },
    getTitle () {
      return i18next.t('navigation.all-discussions');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'room-topic-' + model.get('id'),
    renderScene: function (navigator) {
      let UpdateRoomTopic = require('../../views/RoomTopic');
      return <UpdateRoomTopic navigator={navigator} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.update-room-topic');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

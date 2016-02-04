var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data, room) {
  return {
    renderScene: function (navigator) {
      let GroupRoom = require('../../views/GroupRoom');
      return <GroupRoom navigator={navigator} room={room} data={data}/>;
    },
    getTitle () {
      return i18next.t('navigation.manage-room');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data, model) {
  return {
    renderScene: function (navigator) {
      let RoomEdit = require('../../views/DiscussionBlockedJoin');
      return <RoomEdit navigator={navigator} data={data} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.discussion-blocked-join');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};
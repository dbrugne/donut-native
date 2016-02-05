var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (groupId, saveGroupData) {
  return {
    renderScene: function (navigator) {
      let GroupEditDisclaimer = require('../../views/GroupEditDisclaimer');
      return <GroupEditDisclaimer navigator={navigator} groupId={groupId} saveGroupData={saveGroupData}/>;
    },
    getTitle () {
      return i18next.t('navigation.group-edit-disclaimer');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

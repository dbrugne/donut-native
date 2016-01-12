var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (groupId, user, fetchParent) {
  return {
    renderScene: function (navigator) {
      let GroupUser = require('../../views/GroupUser');
      return <GroupUser navigator={navigator} user={user} groupId={groupId} fetchParent={fetchParent}/>;
    },
    getTitle () {
      return i18next.t('navigation.manage-user');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

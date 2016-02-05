var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (group) {
  return {
    id: 'group-access-' + group.get('id'),
    renderScene: function (navigator) {
      let GroupAccess = require('../../views/GroupAccess');
      return <GroupAccess navigator={navigator} group={group} />;
    },
    getTitle () {
      return i18next.t('navigation.group-access', {groupname: group.get('name')});
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

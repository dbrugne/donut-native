var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'group-users-' + model.get('group_id'),
    renderScene: function (navigator) {
      let GroupUsers = require('../../views/GroupUsers');
      return <GroupUsers navigator={navigator} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.group-users');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

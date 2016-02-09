var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    renderScene: function (navigator) {
      let GroupList = require('../../views/GroupList');
      return <GroupList navigator={navigator} />;
    },
    getTitle () {
      return i18next.t('navigation.all-communities');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

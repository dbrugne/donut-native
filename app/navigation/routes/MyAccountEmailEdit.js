var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (element, refreshParentView) {
  return {
    renderScene: function (navigator) {
      let EmailEdit = require('../../views/MyAccountEmailEdit');
      return <EmailEdit navigator={navigator} email={element} refreshParentView={refreshParentView} />;
    },
    getTitle () {
      return i18next.t('navigation.manage-email');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

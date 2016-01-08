var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (email, refreshParentView) {
  return {
    renderScene: function (navigator) {
      let EmailMain = require('../../views/MyAccountEmail');
      return <EmailMain navigator={navigator} refreshParentView={refreshParentView} email={email} />;
    },
    getTitle: function () {
      return i18next.t('navigation.my-email');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

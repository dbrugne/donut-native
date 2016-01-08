var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (refreshParentView) {
  return {
    renderScene: function (navigator) {
      let EmailAdd = require('../../views/MyAccountEmailsAdd');
      return <EmailAdd navigator={navigator} refreshParentView={refreshParentView} />;
    },
    getTitle () {
      return i18next.t('navigation.add-email');
    }
  };
};

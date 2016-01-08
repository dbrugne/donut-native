var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    getSceneClass () {
      return require('../../views/MyAccountEmails');
    },
    getTitle () {
      return i18next.t('navigation.my-emails');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

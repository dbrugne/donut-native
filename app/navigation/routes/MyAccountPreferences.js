var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    getSceneClass () {
      return require('../../views/MyAccountPreferences');
    },
    getTitle () {
      return i18next.t('navigation.my-preferences');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

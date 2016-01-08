var React = require('react-native');
var i18next = require('../../libs/i18next');

// @todo rename to profile

module.exports = function () {
  return {
    getSceneClass () {
      return require('../../views/MyAccountEdit');
    },
    getTitle () {
      return i18next.t('navigation.my-informations');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

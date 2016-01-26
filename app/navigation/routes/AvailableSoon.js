var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    getSceneClass () {
      return require('../../views/AvailableSoon');
    },
    getTitle () {
      return i18next.t('navigation.available-soon');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

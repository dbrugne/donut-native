var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    getSceneClass () {
      return require('../../views/MyAccountPassword');
    },
    getTitle () {
      return i18next.t('navigation.my-password');
    }
  };
};

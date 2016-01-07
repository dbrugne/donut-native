var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    id: 'about',
    getSceneClass () {
      return require('../../views/About');
    },
    getTitle () {
      return i18next.t('navigation.about');
    }
  };
};

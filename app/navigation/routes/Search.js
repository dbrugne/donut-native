var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    id: 'search',
    initial: true,
    getSceneClass () {
      return require('../../views/Search');
    },
    getTitle () {
      return i18next.t('navigation.search');
    }
  };
};

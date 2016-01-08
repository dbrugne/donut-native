var React = require('react-native');
var i18next = require('../../libs/i18next');
var state = require('../state');

module.exports = function () {
  return {
    id: 'home',
    initial: true,
    getSceneClass () {
      return require('../../views/Discover');
    },
    getTitle () {
      return i18next.t('navigation.discover');
    },
    onBack () {
      if (state.drawerState === 'opened') {
        state.drawer.close();
      } else {
        state.drawer.open();
      }
    }
  };
};

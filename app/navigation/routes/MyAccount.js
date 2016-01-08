var React = require('react-native');
var i18next = require('../../libs/i18next');
var state = require('../state');

module.exports = function () {
  return {
    id: 'my-account',
    initial: true,
    getSceneClass () {
      return require('../../views/MyAccount');
    },
    getTitle () {
      return i18next.t('navigation.my-account');
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

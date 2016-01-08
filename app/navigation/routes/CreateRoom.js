var React = require('react-native');
var i18next = require('../../libs/i18next');
var state = require('../state');

module.exports = function () {
  return {
    id: 'create-room',
    initial: true,
    getSceneClass () {
      return require('../../screens/CreateRoom');
    },
    getTitle () {
      return i18next.t('navigation.create-donut');
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

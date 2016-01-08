var React = require('react-native');
var i18next = require('../../libs/i18next');
var state = require('../state');

module.exports = function () {
  return {
    id: 'notification',
    initial: true,
    getSceneClass () {
      return require('../../views/Notifications');
    },
    getTitle () {
      return i18next.t('navigation.notifications');
    },
    _onDidFocus () {
      this.scene.onFocus();
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

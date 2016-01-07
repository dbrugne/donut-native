var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    id: 'notification',
    initial: true,
    getSceneClass () {
      return require('../../screens/Notifications');
    },
    getTitle () {
      return i18next.t('navigation.notifications');
    },
    _onDidFocus () {
      this.scene.onFocus();
    }
  };
};

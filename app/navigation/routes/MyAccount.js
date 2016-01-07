var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    id: 'my-account',
    initial: true,
    getSceneClass () {
      return require('../../screens/MyAccount');
    },
    getTitle () {
      return i18next.t('navigation.my-account');
    }
  };
};

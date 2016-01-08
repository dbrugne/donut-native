var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    id: 'create-room',
    initial: true,
    getSceneClass () {
      return require('../../views/CreateRoom');
    },
    getTitle () {
      return i18next.t('navigation.create-donut');
    }
  };
};

var React = require('react-native');
var i18next = require('../../libs/i18next');
var state = require('../state');

module.exports = function (data) {
  return {
    id: 'create',
    initial: true,
    renderScene: function (navigator) {
      let CreateRoom = require('../../views/Create');
      return <CreateRoom navigator={navigator} />;
    },
    getTitle () {
      return i18next.t('navigation.create');
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

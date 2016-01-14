var React = require('react-native');
var state = require('../state');
var app = require('../../libs/app');

module.exports = function (element) {
  return {
    id: 'group' + element.id,
    initial: true,
    model: app.groups.iwhere('group_id', element.id),
    renderScene: function (navigator) {
      let GroupHome = require('../../views/Group');
      return <GroupHome navigator={navigator} element={element} />;
    },
    getTitle () {
      return element.name;
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

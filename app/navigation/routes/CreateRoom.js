var React = require('react-native');
var i18next = require('../../libs/i18next');
var state = require('../state');

module.exports = function (data) {
  return {
    id: 'create-room-' + (data && data.group_id ? data.group_id : ''),
    group_id: data && data.group_id ? data && data.group_id : null,
    group_identifier: data && data.group_identifier ? data && data.group_identifier : null,
    renderScene: function (navigator) {
      let CreateRoom = require('../../views/CreateRoom');
      return <CreateRoom navigator={navigator} group_id={this.group_id} group_identifier={this.group_identifier} />;
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

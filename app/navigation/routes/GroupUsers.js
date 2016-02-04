'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    id: 'group-users-' + data.group_id,
    renderScene: function (navigator) {
      let GroupUsers = require('../../views/GroupUsers');
      return <GroupUsers navigator={navigator} data={data} />;
    },
    getTitle () {
      return i18next.t('navigation.group-users');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

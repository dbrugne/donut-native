'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (id) {
  return {
    id: 'group-users-' + id,
    renderScene: function (navigator) {
      let GroupUsers = require('../../views/GroupUsers');
      return <GroupUsers navigator={navigator} id={id} />;
    },
    getTitle () {
      return i18next.t('navigation.group-users');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

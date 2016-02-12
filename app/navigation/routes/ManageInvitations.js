'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    renderScene: function (navigator) {
      let ManageInvitations = require('../../views/ManageInvitations');
      return <ManageInvitations navigator={navigator} data={data}/>;
    },
    getTitle () {
      return i18next.t('navigation.manage-invitations');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

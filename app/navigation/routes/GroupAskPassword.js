'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (id) {
  return {
    renderScene: function (navigator) {
      let GroupAskMembershipPassword = require('../../views/GroupAskPassword');
      return (<GroupAskMembershipPassword navigator={navigator} id={id} scroll />);
    },
    getTitle () {
      return i18next.t('navigation.ask-membership-password');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};
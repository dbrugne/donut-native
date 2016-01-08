'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (element) {
  return {
    renderScene: function (navigator) {
      let GroupAskMembershipRequest = require('../../views/GroupAskRequest');
      return (<GroupAskMembershipRequest navigator={navigator} id={element.id} isAllowedPending={element.isAllowedPending} />);
    },
    getTitle () {
      return i18next.t('navigation.ask-membership-request');
    }
  };
};

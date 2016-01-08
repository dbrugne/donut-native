'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (element) {
  return {
    renderScene: function (navigator) {
      let GroupAskMembershipEmail = require('../../views/GroupAskEmail');
      return (<GroupAskMembershipEmail navigator={navigator} id={element.id} domains={element.domains} />);
    },
    getTitle () {
      return i18next.t('navigation.ask-membership-email');
    }
  };
};

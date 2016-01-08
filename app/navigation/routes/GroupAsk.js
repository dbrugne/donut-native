'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (id) {
  return {
    renderScene: function (navigator) {
      let GroupAskMembership = require('../../views/GroupAsk');
      return (<GroupAskMembership navigator={navigator} id={id} />);
    },
    getTitle () {
      return i18next.t('navigation.ask-membership');
    }
  };
};

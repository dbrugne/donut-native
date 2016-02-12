'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    renderScene: function (navigator) {
      let AllowedUsers = require('../../views/AllowedUsers');
      return <AllowedUsers navigator={navigator} data={data} />;
    },
    getTitle () {
      return i18next.t('navigation.allowed-users');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

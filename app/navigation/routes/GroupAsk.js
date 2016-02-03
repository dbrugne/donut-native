'use strict';

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    renderScene: function (navigator) {
      let GroupAskMembership = require('../../views/GroupAsk');
      return (<GroupAskMembership navigator={navigator} data={data}/>);
    },
    getTitle () {
      return i18next.t('navigation.ask-membership');
    },
    _onDidFocus: function () {
      if (this.scene.onFocus) {
        this.scene.onFocus();
      }
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

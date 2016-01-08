var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function () {
  return {
    renderScene: function (navigator) {
      let Eutc = require('../../loggedOut/eutc'); // @todo => Eutc + call differently from loggedOut
      return <Eutc navigator={navigator} fromNavigation />;
    },
    getTitle () {
      return i18next.t('navigation.eutc');
    }
  };
};

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    renderScene: function (navigator) {
      let Report = require('../../views/Report');
      return <Report navigator={navigator} data={data}/>;
    },
    getTitle () {
      return i18next.t('navigation.report');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (data) {
  return {
    renderScene: function (navigator) {
      return (<data.component navigator={navigator} data={data} />);
    },
    getTitle () {
      return i18next.t('navigation.change-value');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

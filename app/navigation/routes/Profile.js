var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (element) {
  return {
    id: 'profile-' + element.id,
    renderScene: function (navigator) {
      let Profile = require('../../views/Profile');
      return <Profile navigator={navigator} element={element} />;
    },
    getTitle () {
      return element.identifier;
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

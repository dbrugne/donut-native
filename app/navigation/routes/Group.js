var React = require('react-native');

module.exports = function (element) {
  return {
    id: 'group' + element.id,
    initial: true,
    renderScene: function (navigator) {
      let GroupHome = require('../../views/Group');
      return <GroupHome navigator={navigator} element={element} />;
    },
    getTitle () {
      return element.name;
    }
  };
};

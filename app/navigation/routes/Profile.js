var React = require('react-native');
var app = require('../../libs/app');
var RightIcon = require('../components/RightIconSettings');

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
    renderRightButton: function (navigator) {
      var model = app.rooms.iwhere('id', element.id);
      return (<RightIcon model={model}/>);
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

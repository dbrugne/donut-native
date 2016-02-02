var React = require('react-native');
var state = require('../state');
var app = require('../../libs/app');
var RightIcon = require('../components/RightIconGroup');

module.exports = function (element) {
  return {
    id: 'discussion-' + element.id,
    initial: true,
    model: app.groups.iwhere('group_id', element.id),
    renderScene: function (navigator) {
      let GroupHome = require('../../views/Group');
      return <GroupHome navigator={navigator} element={element} />;
    },
    getTitle () {
      return element.name;
    },
    _onDidFocus: function () {
      if (this.scene.onFocus) {
        this.scene.onFocus();
      }
    },
    renderRightButton: function (navigator) {
      var model = app.groups.get(element.id);
      return (<RightIcon model={model}/>);
    },
    onBack () {
      if (state.drawerState === 'opened') {
        state.drawer.close();
      } else {
        state.drawer.open();
      }
    }
  };
};

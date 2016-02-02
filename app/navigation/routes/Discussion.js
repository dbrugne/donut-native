var React = require('react-native');
var state = require('../state');
var RightIcon = require('../components/RightIconSettings');

module.exports = function (model) {
  return {
    id: 'discussion-' + model.get('id'),
    initial: true,
    model: model, // only for discussion routes
    renderScene: function (navigator) {
      let Discussion = require('../../views/Discussion');
      return <Discussion navigator={navigator} model={model} />;
    },
    getTitle () {
      return model.get('identifier');
    },
    renderRightButton: function (navigator) {
      return (<RightIcon model={model}/>);
    },
    _onDidFocus: function () {
      if (this.scene.onFocus) {
        this.scene.onFocus();
      }
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

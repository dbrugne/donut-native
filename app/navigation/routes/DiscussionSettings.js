var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (model) {
  return {
    id: 'discussion-settings-' + model.get('id'),
    model: model, // only for discussion routes
    renderScene: function (navigator) {
      let Settings = require('../../views/DiscussionSettings');
      return <Settings navigator={navigator} model={model} />;
    },
    getTitle () {
      return i18next.t('navigation.settings');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};

var React = require('react-native');
var i18next = require('../../libs/i18next');

module.exports = function (infos, data) {
  return {
    renderScene: function (navigator) {
      let DiscussionBlockedJoin = require('../../views/DiscussionBlockedJoin');
      return <DiscussionBlockedJoin navigator={navigator} infos={infos} data={data} />;
    },
    getTitle () {
      return i18next.t('navigation.discussion-blocked-join');
    },
    onBack () {
      this.scene.props.navigator.pop();
    }
  };
};
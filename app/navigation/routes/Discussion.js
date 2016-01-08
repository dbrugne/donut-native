var React = require('react-native');
var {
  TouchableOpacity
  } = React;
var Icon = require('react-native-icons').Icon;
import ExNavigator from '@exponent/react-native-navigator';
var navigation = require('../index');
var state = require('../state');

module.exports = function (model) {
  return {
    id: 'discussion-' + model.get('id'),
    initial: true,
    model: model, // only for discussion routes
    renderScene: function (navigator) {
      var Discussion = (model.get('blocked') === true)
        ? require('../../views/DiscussionBlocked')
        : require('../../views/Discussion');

      return <Discussion navigator={navigator} model={model}/>;
    },
    getTitle () {
      return model.get('identifier');
    },
    renderRightButton: function (navigator) {
      if (model.get('blocked') === true) {
        return null;
      }

      return (
        <TouchableOpacity
          touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
          onPress={() => navigation.navigate('DiscussionSettings', model)}
          style={ExNavigator.Styles.barRightButton}>
          <Icon color='#fc2063' name='fontawesome|cog' size={25}
                style={{
                  width: 24,
                  height: 24,
                  fontSize: 18,
                  marginRight: 10,
                  paddingVertical: 20
                }} />
        </TouchableOpacity>
      );
    },
    _onDidFocus: function () {
      if (model.get('blocked') === true) {
        return;
      }

      this.scene.onFocus();
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

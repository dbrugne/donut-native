var _ = require('underscore');
var React = require('react-native');
var {
  TouchableOpacity,
  Platform
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
      var Discussion = (model.get('blocked') === false || model.get('type') === 'onetoone') // do not inverse that condition unless you exactly now what you are doing
        ? require('../../views/Discussion')
        : require('../../views/DiscussionBlocked');

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
          style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 44}} >
          <Icon name='fontawesome|cog'
                size={22}
                color='#999998'
                style={[{width: 22, height: 22}]} />
        </TouchableOpacity>
      );
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

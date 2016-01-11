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
      var Discussion = (_.contains(['kicked', 'banned', true], model.get('blocked'))) // @todo dbrugne why kicked or true hrtr ???
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
          <Icon name='fontawesome|cog'
                size={25}
                color='#999998'
                style={[ExNavigator.Styles.barButtonIcon, {marginRight: 16, width: 22, height: 22}, Platform.OS === 'android' ? {marginTop: 0} : {marginTop: 0}]} />
        </TouchableOpacity>
      );
    },
    _onDidFocus: function () {
      if (model.get('blocked') === true) {
        return;
      }

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
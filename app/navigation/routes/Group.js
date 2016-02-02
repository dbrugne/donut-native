var React = require('react-native');
var {
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');
import ExNavigator from '@exponent/react-native-navigator';
var navigation = require('../index');
var state = require('../state');
var app = require('../../libs/app');

module.exports = function (element) {
  return {
    id: 'group' + element.id,
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
      if (model.get('blocked') === true) {
        return null;
      }

      return (
        <TouchableOpacity
          touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
          onPress={() => navigation.navigate('GroupSettings', model)}
          style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 44}} >
          <Icon
            name='cog'
            size={22}
            color='#999998'
          />
        </TouchableOpacity>
      );
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

var React = require('react-native');
var {
  TouchableOpacity
  } = React;
var currentUser = require('../../models/current-user');
import ExNavigator from '@exponent/react-native-navigator';
var Icon = require('react-native-vector-icons/FontAwesome');
var navigation = require('../index');
var app = require('../../libs/app');

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
      if (element.type === 'room' && model && (model.currentUserIsOwner() || model.currentUserIsOp() || currentUser.isAdmin())) {
        return (
          <TouchableOpacity
            touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
            onPress={() => navigation.navigate('DiscussionSettings', model)}
            style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 44}} >
            <Icon
              name='cog'
              size={22}
              color='#999998'
              />
          </TouchableOpacity>
        );
      }

      if (currentUser.get('user_id') !== element.id) {
        return null;
      }

      return (
        <TouchableOpacity
          touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
          onPress={() => navigation.navigate('MyAccount')}
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
      this.scene.props.navigator.pop();
    }
  };
};

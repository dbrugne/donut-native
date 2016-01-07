var LeftNavigation = require('../components/DrawerIcon');
var i18next = require('../libs/i18next');

class GroupCreationRoute extends Route {
  var id = 'create-group';
  var initial = true;
  getSceneClass () {
    return require('../../screens/GroupCreate');
  }
  getTitle () {
    return i18next.t('navigation.create-group');
  }
  renderLeftButton (navigator) {
    return (<LeftNavigation navigator={navigator} />);
  }
}

module.exports = GroupCreationRoute;

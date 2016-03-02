'use strict';

var React = require('react-native');
var {
  TouchableOpacity,
  View,
  Text
} = React;
var Icon = require('react-native-vector-icons/EvilIcons');
import ExNavigator from '@exponent/react-native-navigator';
var _ = require('underscore');
var app = require('../libs/app');
var state = require('./state');
var i18next = require('../libs/i18next');
var DrawerIcon = require('./components/DrawerIcon');

var routeTemplate = {
  __type: 'route',
  renderTitle () {
    let title = this.getTitle();
    title = title.length > 24
      ? title.substr(0, 24) + '…'
      : title;
    return (
      <View style={{alignSelf: 'stretch', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontFamily: 'Open sans', fontSize: 13, color: '#353F4C', fontWeight: 'bold', letterSpacing: 1}}>
          {title}
        </Text>
      </View>
    );
  },
  renderBackButton (navigator) {
    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => navigator.pop()}
        style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}} >
          <Icon
            name='chevron-left'
            size={35}
            color='#FC2063'
            style={{marginLeft: 5, backgroundColor: 'transparent'}}
          />
        </View>
      </TouchableOpacity>
    );
  },
  onWillFocus () {
    // this.model is null for non discussion views
    app.setFocusedModel(this.model);

    this._onWillFocus();
  },
  onDidFocus () {
    state.currentRoute = this;

    React.InteractionManager.runAfterInteractions(() => {
      state._logCurrentStack();
      this._onDidFocus();
    });
  },
  onWillBlur () {
    this._onWillBlur();
  },
  onDidBlur () {
    _.defer(() => {
      this._onDidBlur();
    });
  },
  _onWillFocus: _.noop,
  _onDidFocus: _.noop,
  _onWillBlur: _.noop,
  _onDidBlur: _.noop
};

var initialRouteTemplate = {
  configureScene () {
    // @important simplest transition possible to avoid performance leak (on Android mostly)
    return ExNavigator.SceneConfigs.Fade;
  },
  renderLeftButton () {
    return (<DrawerIcon navigator={navigator} />);
  }
};

var nonInitialRouteTemplate = {
  configureScene () {
    return ExNavigator.SceneConfigs.FloatFromRight;
  }
};

module.exports = {
  getDefaultRoute () {
    return this.getRoute('Discover');
  },
  getRoute (name, args) {
    if (!/^[a-zA-Z-]+$/.test(name)) {
      return;
    }

    var Route = this._load(name);
    if (!Route) {
      return;
    }

    var _route = Route.apply(null, args);

    // singleton, Navigator compare route as Object reference
    if (_route.id && state.existingRoutes[_route.id]) {
      return state.existingRoutes[_route.id];
    }

    // @important first {} avoid duplicate object reference!
    var route = (_route.initial === true)
      ? _.extendOwn({}, initialRouteTemplate, routeTemplate, _route)
      : _.extendOwn({}, nonInitialRouteTemplate, routeTemplate, _route);

    // only if view should be singletoned
    if (_route.id) {
      state.existingRoutes[_route.id] = route;
    }

    return route;
  },
  _load (name) {
    // cannot load dynamical name with require() due to packager
    switch (name) {
      case 'Discover':
        return require('./routes/Discover');
      case 'Search':
        return require('./routes/Search');
      case 'Profile':
        return require('./routes/Profile');
      case 'Group':
        return require('./routes/Group');
      case 'GroupAccess':
        return require('./routes/GroupAccess');
      case 'GroupRoom':
        return require('./routes/GroupRoom');
      case 'GroupRooms':
        return require('./routes/GroupRooms');
      case 'GroupAsk':
        return require('./routes/GroupAsk');
      case 'GroupAskEmail':
        return require('./routes/GroupAskEmail');
      case 'GroupAskPassword':
        return require('./routes/GroupAskPassword');
      case 'GroupAskRequest':
        return require('./routes/GroupAskRequest');
      case 'GroupUsers':
        return require('./routes/GroupUsers');
      case 'GroupSettings':
        return require('./routes/GroupSettings');
      case 'GroupList':
        return require('./routes/GroupList');
      case 'Create':
        return require('./routes/Create');
      case 'CreateRoom':
        return require('./routes/CreateRoom');
      case 'CreateGroup':
        return require('./routes/CreateGroup');
      case 'Notifications':
        return require('./routes/Notifications');
      case 'Discussion':
        return require('./routes/Discussion');
      case 'DiscussionSettings':
        return require('./routes/DiscussionSettings');
      case 'DiscussionBlockedJoin':
        return require('./routes/DiscussionBlockedJoin');
      case 'MyAccount':
        return require('./routes/MyAccount');
      case 'MyAccountEmail':
        return require('./routes/MyAccountEmail');
      case 'MyAccountEmailEdit':
        return require('./routes/MyAccountEmailEdit');
      case 'MyAccountEmails':
        return require('./routes/MyAccountEmails');
      case 'MyAccountEmailsAdd':
        return require('./routes/MyAccountEmailsAdd');
      case 'MyAccountPassword':
        return require('./routes/MyAccountPassword');
      case 'MyAccountPreferences':
        return require('./routes/MyAccountPreferences');
      case 'UserField':
        return require('./routes/UserField');
      case 'About':
        return require('./routes/About');
      case 'Eutc':
        return require('./routes/Eutc');
      case 'RoomTopic':
        return require('./routes/RoomTopic');
      case 'RoomAccess':
        return require('./routes/RoomAccess');
      case 'RoomUsers':
        return require('./routes/RoomUsers');
      case 'RoomList':
        return require('./routes/RoomList');
      case 'RoomEditDescription':
        return require('./routes/RoomEditDescription');
      case 'RoomEditDisclaimer':
        return require('./routes/RoomEditDisclaimer');
      case 'RoomEditWebsite':
        return require('./routes/RoomEditWebsite');
      case 'AvailableSoon':
        return require('./routes/AvailableSoon');
      case 'Report':
        return require('./routes/Report');
      case 'ManageInvitations':
        return require('./routes/ManageInvitations');
      case 'AllowedUsers':
        return require('./routes/AllowedUsers');
    }
  }
};

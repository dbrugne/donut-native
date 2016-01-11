'use strict';

var React = require('react-native');
var {
  TouchableOpacity,
  View,
  Text,
  Platform
} = React;

var Icon = require('react-native-icons').Icon;
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
    title = title.length > 18
      ? title.substr(0, 18) + '…'
      : title;
    return (
      <View style={{alignSelf: 'center'}}>
        <Text style={{fontFamily: '.HelveticaNeueInterface-MediumP4', fontSize: 16, color: '222', fontWeight: 'bold'}}>
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
        style={ExNavigator.Styles.barBackButton} >
        <Icon name='fontawesome|angle-left'
              size={18}
              color='#999998'
              style={[ExNavigator.Styles.barButtonIcon, {marginLeft: 5, width: 18, height: 18}, Platform.OS === 'android' ? {marginTop: 18} : {marginTop: 12}]} />
        <Text style={[ExNavigator.Styles.barButtonText, {color: '#999998'}, Platform.OS === 'android' ? {marginTop: 16} : {marginTop: 11}]}> {i18next.t('navigation.back')}</Text>
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

    // delay heavy processing logic (e.g. history fetching and rendering) to
    // avoid animation leak (visibly onDidFocus is triggered before transition end)
    setTimeout(() => {
      state._logCurrentStack();
      this._onDidFocus();
    }, 100);
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
    return ExNavigator.SceneConfigs.FloatFromRight;
  },
  renderLeftButton () {
    return (<DrawerIcon navigator={navigator} />);
  }
};

var nonInitialRouteTemplate = {
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
      case 'MyAccountInformation':
        return require('./routes/MyAccountInformation');
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
      case 'RoomUsers':
        return require('./routes/RoomUsers');
      case 'RoomUser':
        return require('./routes/RoomUser');
    }
  }
};

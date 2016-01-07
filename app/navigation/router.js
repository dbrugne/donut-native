'use strict';

var React = require('react-native');
var {
  TouchableOpacity,
  Text
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
  onBack () {
    if (state.drawerState === 'opened') {
      return state.closeDrawer();
    }

    var baseRoute = ['home', 'my-account', 'search', 'create-room', 'create-group', 'notification'];
    var isDiscussion = (state.currentRoute && state.currentRoute.model && (state.currentRoute.model.get('type') === 'onetoone' || state.currentRoute.model.get('type') === 'room'));
    if (baseRoute.indexOf(state.currentRoute.id) !== -1 || isDiscussion) {
      return state.openDrawer();
    }
    this.scene.props.navigator.pop();
  },
  renderBackButton (navigator) {
    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => navigator.pop()}
        style={ExNavigator.Styles.barBackButton} >
        <Icon name='fontawesome|angle-left'
              size={18}
              color='#fc2063'
              style={[ExNavigator.Styles.barButtonIcon, {marginTop: 13, marginLeft: 5, width: 18, height: 18}]} />
        <Text style={[ExNavigator.Styles.barButtonText, {marginTop: 11, color: '#fc2063'}]}> {i18next.t('navigation.back')}</Text>
      </TouchableOpacity>
    );
  }
};

module.exports = {
  getDefaultRoute () {
    return this.getRoute('Home');
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
      case 'Home':
        return require('./routes/Home');
      case 'Search':
        return require('./routes/Search');
      case 'Profile':
        return require('./routes/Profile');
      case 'Group':
        return require('./routes/Group');
      case 'CreateRoom':
        return require('./routes/CreateRoom');
      case 'Notifications':
        return require('./routes/Notifications');
      case 'Discussion':
        return require('./routes/Discussion');
      case 'DiscussionSettings':
        return require('./routes/DiscussionSettings');
      case 'MyAccount':
        return require('./routes/MyAccount');
      case 'About':
        return require('./routes/About');
    }
  }
};

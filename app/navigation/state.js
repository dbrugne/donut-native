var React = require('react-native');
var {
  StatusBarIOS,
  Platform,
  InteractionManager
} = React;

var _ = require('underscore');
var dismissKeyboard = require('dismissKeyboard');
var SubNavigator = require('./SubNavigator');
var debug = require('../libs/debug')('navigation');

module.exports = {
  rootNavigator: null,
  existingNavigators: {},
  currentNavigator: null,
  existingRoutes: {},
  currentRoute: null,

  drawer: null,
  drawerState: 'closed',
  drawerInAnimationHandle: null,

  reset () {
    // reset navigation state (@logout)
    this.rootNavigator = null;
    this.existingNavigators = {};
    this.currentNavigator = null;
    this.existingRoutes = {};
    this.currentRoute = null;
    this.drawerInAnimationHandle = null;

    this.drawer = null;
    this.drawerState = 'closed';
  },

  getInitialRoute () {
    var router = require('./router');
    var initialRoute = this.getNavigator(router.getDefaultRoute());

    if (!this.currentNavigator) {
      this.currentNavigator = initialRoute;
    }

    return initialRoute;
  },

  // =============================
  // Drawer
  // =============================

  onDrawerDidOpen () {
    if (this.drawerInAnimationHandle) {
      InteractionManager.clearInteractionHandle(this.drawerInAnimationHandle);
    }
    dismissKeyboard();
    debug.log('onDrawerOpen', this.drawerState);
    this.drawerState = 'opened';
    if (Platform.OS === 'ios') {
      StatusBarIOS.setHidden(true, 'slide');
    }
  },
  onDrawerDidClose () {
    debug.log('onDrawerClose', this.drawerState);
    this.drawerState = 'closed';
    if (Platform.OS === 'ios') {
      StatusBarIOS.setHidden(false, 'slide');
    }
    if (this.drawerInAnimationHandle) {
      // @important timeout 50 ms to avoid animation leak
      setTimeout(() => {
        InteractionManager.clearInteractionHandle(this.drawerInAnimationHandle);
      }, 50);
    }
  },

  // =============================
  // RootNavigation
  // =============================

  getNavigator (initialRoute) {
    var id = 'nav-' + initialRoute.id;

    if (!this.existingNavigators[id]) {
      this.existingNavigators[id] = SubNavigator(this, id, initialRoute);
    }

    return this.existingNavigators[id];
  },

  // =============================
  // Debug
  // =============================

  _logCurrentStack () {
    debug.log('Screen ' + this.currentNavigator.id + '/' + this.currentRoute.id + ' is focused');
    var stack = '\n\u00BB rootNavigator';
    _.each(this.existingNavigators, (n) => {
      stack += '\n  \u00BB ' + n.id;
      if (n.id === this.currentNavigator.id) {
        stack += ' *';
      }
      if (!n.scene) {
        stack += '\n    \u00BB <unknown>';
        return;
      }

      _.each(n.scene.__navigator.getCurrentRoutes(), (r) => {
        stack += '\n    \u00BB ' + ((r.getTitle) ? r.getTitle() : r.id);
        if (r.id === this.currentRoute.id) {
          stack += ' *';
        }
      });
    });
    debug.log(stack);
  }
};

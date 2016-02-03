var React = require('react-native');
var {
  InteractionManager
  } = React;
var _ = require('underscore');
var state = require('./state');
var debug = require('../libs/debug')('navigation');

module.exports = {

  // =============================
  // Drawer
  // =============================

  openDrawer () {
    if (state.drawer && state.drawerState === 'closed') {
      state.drawerInAnimationHandle = InteractionManager.createInteractionHandle();
      state.drawer.open();
    }
  },
  closeDrawer () {
    if (state.drawer && state.drawerState === 'opened') {
      state.drawerInAnimationHandle = InteractionManager.createInteractionHandle();
      state.drawer.close();
    }
  },
  toggleDrawer () {
    if (state.drawerState === 'opened') {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  },

  // =============================
  // Navigation
  // =============================

  navigate () {
    if (!arguments.length) {
      return debug.warn('.navigate() was called without argument');
    }
    var args = Array.prototype.slice.call(arguments);
    var page = args.shift();
    var router = require('./router'); // @important lazy load
    var route = router.getRoute(page, args);
    if (!route) {
      return debug.warn('.navigate() unable to find route for arguments', arguments);
    }

    // always close drawer on navigation
    this.closeDrawer();

    if (route.initial === true) {
      // determine if we need to .popToTop() current stack
      var previousNavigator = state.currentNavigator.scene.__navigator;
      if (previousNavigator.state.routeStack.length > 1 && state.currentRoute.initial !== true) {
        previousNavigator.popToTop();
      }

      // navigate to
      var navigator = state.getNavigator(route);

      InteractionManager.runAfterInteractions(() => {
        this._switchTo(navigator);
      });
    } else {
      if (!state.currentNavigator) {
        return debug.warn('no current navigator');
      }
      InteractionManager.runAfterInteractions(() => {
        state.currentNavigator.scene.__navigator.push(route);
      });
    }
  },

  // =============================
  // Navigator component override
  // =============================

  _switchTo (route) {
    this._pushOrJumpTo(state.rootNavigator.__navigator, route);
  },
  _pushOrJumpTo (navigator, route) {
    var existingRoute = navigator.getCurrentRoutes().find((element) => element === route);
    if (existingRoute) {
      navigator.jumpTo(route);
    } else {
      this._pushToBottom(navigator, route);
    }
  },
  _pushToBottom (navigator, route) {
    var activeStack = navigator.state.routeStack;
    var activeAnimationConfigStack = navigator.state.sceneConfigStack;
    var nextStack = activeStack.concat([route]);
    var destIndex = nextStack.length - 1;
    var nextAnimationConfigStack = activeAnimationConfigStack.concat([
      navigator.props.configureScene(route)
    ]);
    navigator._emitWillFocus(nextStack[destIndex]);
    navigator.setState({
      routeStack: nextStack,
      sceneConfigStack: nextAnimationConfigStack
    }, () => {
      navigator._enableScene(destIndex);
      navigator._transitionTo(destIndex);
    });
  },
  removeDiscussionRoute (model) {
    var router = require('./router'); // @important lazy load
    var _route = router.getRoute('Discussion', [model]);
    var route = state.getNavigator(_route);
    var existingRoute = state.rootNavigator.getCurrentRoutes().find((element) => element === route);
    if (!existingRoute) {
      return; // view is not mounted, no op
    }

    var existingRouteIndex = state.rootNavigator.getCurrentRoutes().indexOf(existingRoute);
    var navigator = state.rootNavigator.__navigator;
    var presentedIndex = navigator.state.presentedIndex;
    var isFocused = (presentedIndex === existingRouteIndex);
    if (isFocused) {
      this._popNicelyToHome(navigator, existingRouteIndex);
    } else {
      this._popNicely(navigator, existingRouteIndex);
    }
  },
  _popNicely (navigator, index) {
    if (index === 0) {
      return;
    }
    // Remove any unneeded rendered routes.
    var configStack = navigator.state.sceneConfigStack;
    configStack.splice(index, 1);
    var routeStack = navigator.state.routeStack;
    var poppedRoute = routeStack.splice(index, 1)[0];
    state.existingNavigators = _.omit(state.existingNavigators, poppedRoute.id);
    navigator.setState({
      sceneConfigStack: configStack,
      routeStack: routeStack
    });
  },
  _popNicelyToHome (navigator, index) {
    // already on home?
    if (navigator.state.presentedIndex === 0) {
      this._popNicely(navigator, index);
    }

    // transition to home (index:0)
    var popIndex = 0;
    navigator._enableScene(popIndex);
    navigator._emitWillFocus(navigator.state.routeStack[popIndex]);
    navigator._transitionTo(
      popIndex,
      null, // default velocity
      null, // no spring jumping
      () => this._popNicely(navigator, index)
    );
  }
};

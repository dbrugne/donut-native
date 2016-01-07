'use strict';

var React = require('react-native');
var {
  Platform
} = React;

import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'

module.exports = function (state, id, initialRoute) {
  return {
    id: id,
    alreadyFocused: false,
    focused: false,
    renderScene: function (rootNavigator) {
      var navigationBarHeight = (Platform.OS === 'android')
        ? 56
        : 64;

      return (
        <ExNavigator
          rootNavigator={rootNavigator}
          initialRoute={initialRoute}
          style={{flex: 1}}
          sceneStyle={{ paddingTop: navigationBarHeight }}
          titleStyle={{ fontSize: 16, color: '#22222', alignSelf: 'center' }}
        />
      );
    },
    onWillFocus: function (event) {
      this.focused = true;
      state.currentNavigator = state.existingNavigators[id];

      // find currently focused route
      if (!state.existingNavigators[id].scene) {
        // navigator is not already mounted (onWILLFocus)
        return initialRoute.onWillFocus();
      } else {
        var nav = state.existingNavigators[id].scene.__navigator;
        var route = nav.state.routeStack[nav.state.presentedIndex];
        route.onWillFocus();
      }
    },
    onDidFocus: function (event) {
      this.focused = true;
      // exNavigator trigger first focus on navigator AND on initialRoute
      // for next focus only navigator is triggered
      if (!this.alreadyFocused) {
        this.alreadyFocused = true;
        return;
      }

      // find currently focused route
      var nav = state.existingNavigators[id].scene.__navigator;
      var route = nav.state.routeStack[nav.state.presentedIndex];
      route.onDidFocus();
    },
    onWillBlur: function (event) {
      this.focused = false;
      // find currently focused route
      var nav = state.existingNavigators[id].scene.__navigator;
      var route = nav.state.routeStack[nav.state.presentedIndex];
      route.onWillBlur();
    },
    onDidBlur: function (event) {
      this.focused = false;
      // find currently focused route
      var nav = state.existingNavigators[id].scene.__navigator;
      var route = nav.state.routeStack[nav.state.presentedIndex];
      route.onDidBlur();
    }
  };
};

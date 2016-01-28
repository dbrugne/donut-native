'use strict';

var React = require('react-native');
var {
  Platform
} = React;

import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'

// @hack https://github.com/dbrugne/donut-native/issues/156
React.Navigator.NavigationBar.StylesAndroid.General.NavBarHeight =
  React.Navigator.NavigationBar.StylesAndroid.General.TotalNavHeight =
    46;

// @hack style correctly navigationBar
var add = {marginLeft: 0, flexDirection: 'column', justifyContent: 'center'};
var _Stages = React.Navigator.NavigationBar.Styles.Stages;
React.Navigator.NavigationBar.Styles.Stages = {
  Left: {
    Title: [_Stages.Left.Title, add],
    LeftButton: [_Stages.Left.LeftButton, add],
    RightButton: [_Stages.Left.RightButton, add]
  },
  Center: {
    Title: [_Stages.Center.Title, add],
    LeftButton: [_Stages.Center.LeftButton, add],
    RightButton: [_Stages.Center.RightButton, add]
  },
  Right: {
    Title: [_Stages.Right.Title, add],
    LeftButton: [_Stages.Right.LeftButton, add],
    RightButton: [_Stages.Right.RightButton, add]
  }
};

module.exports = function (state, id, initialRoute) {
  return {
    id: id,
    alreadyFocused: false,
    focused: false,
    renderScene: function (rootNavigator) {
      return (
        <ExNavigator
          rootNavigator={rootNavigator}
          initialRoute={initialRoute}
          style={{flex: 1}}
          sceneStyle={{ paddingTop: React.Navigator.NavigationBar.Styles.General.TotalNavHeight }}
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
      var nav = state.existingNavigators[id].scene.__navigator; // @todo crash when i'm banned from this room
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

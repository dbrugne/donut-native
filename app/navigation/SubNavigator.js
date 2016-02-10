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
var add = {marginLeft: 0, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#D0D9E6'};
var platformTitle = (Platform.OS === 'android') ? {paddingTop:10} : {};
var platformLeftButton = (Platform.OS === 'android') ? {marginTop:-5} : {};
var platformRightButton = (Platform.OS === 'android') ? {marginTop:-5} : {};

var _Stages = React.Navigator.NavigationBar.Styles.Stages;
React.Navigator.NavigationBar.Styles.Stages = {
  Left: {
    Title: [_Stages.Left.Title, add, platformTitle],
    LeftButton: [_Stages.Left.LeftButton, add, platformLeftButton],
    RightButton: [_Stages.Left.RightButton, add, platformRightButton]
  },
  Center: {
    Title: [_Stages.Center.Title, add, platformTitle],
    LeftButton: [_Stages.Center.LeftButton, add, platformLeftButton],
    RightButton: [_Stages.Center.RightButton, add, platformRightButton]
  },
  Right: {
    Title: [_Stages.Right.Title, add, platformTitle],
    LeftButton: [_Stages.Right.LeftButton, add, platformLeftButton],
    RightButton: [_Stages.Right.RightButton, add, platformRightButton]
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

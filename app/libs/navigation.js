'use strict';

/**
 * /home
 * /search
 * /create-group
 * /create-room
 * /my-account
 *   /my-email
 *   /my-password
 *   /notifications
 *   /profile-edit
 *   /...
 * /discussion
 *   /users
 *   /settings
 *
 * popable
 *   /profile/_id_
 */

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableOpacity
} = React;

var _ = require('underscore');
var Drawer = require('react-native-drawer')
import ExNavigator from '@exponent/react-native-navigator';
var Button = require('react-native-button');

let navigationBarHeight = 64;
var drawer;
var drawerOpened = false;
var rootNavigator;
var navigators = {};
var knownRoutes = {};
var currentNavigator;
var currentRoute;
var routes = module.exports = {};

function getRoute (route) {
  // singleton, Navigator compare route as Object reference
  if (knownRoutes[route.id]) {
    return knownRoutes[route.id];
  }

  knownRoutes[route.id] = _.defaults(route, _.clone({
    id: null,
    // no arrow function, otherwise the parent context is passed as 'this'
    onWillFocus: function () {
      console.log('will focus', this.id);
    },
    onDidFocus: function () {
      currentRoute = this;
      console.log('Screen ' + currentNavigator.id + '/' + currentRoute.id + ' is now focused');
      _logCurrentStack();
    },
    onWillBlur: _.noop,
    onDidBlur: _.noop
  }));

  return knownRoutes[route.id];
}

function _pushOrJumpTo (navigator, route) {
  var existingRoute = navigator.getCurrentRoutes().find((element) => element === route);
  if (existingRoute) {
    navigator.jumpTo(route);
  } else {
    _pushToBottom(navigator, route);
  }
}

function _pushToBottom (navigator, route) {
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
    sceneConfigStack: nextAnimationConfigStack,
  }, () => {
    navigator._enableScene(destIndex);
    navigator._transitionTo(destIndex);
  });
}

function _logCurrentStack () {
  _.defer(() => {
    var stack = '\n\u00BB rootNavigator';
    _.each(navigators, function (n) {
      stack += '\n  \u00BB ' + n.id;
      if (n.id === currentNavigator.id) {
        stack += ' *';
      }
      if (!n.scene) {
        stack += '\n    \u00BB <unknown>';
        return;
      }

      _.each(n.scene.__navigator.getCurrentRoutes(), (r) => {
        stack += '\n    \u00BB ' + r.id;
        if (r.id === currentRoute.id) {
          stack += ' *';
        }
      });
    });

    console.log(stack);
  });
}

var LeftNavigation = React.createClass({
  render () {
    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => drawer.open()}
        style={ExNavigator.Styles.barLeftButton}>
        <Text style={ExNavigator.Styles.barLeftButtonText}>NAV</Text>
      </TouchableOpacity>
    );
  }
});

routes.getHome = function () {
  return getRoute({
    id: 'home',
    getSceneClass: function () {
      return require('../screens/Home');
    },
    getTitle: function () {
      return this.id;
    },
    configureScene: function () {
      return ExNavigator.SceneConfigs.FloatFromRight;
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};

routes.getProfile = function (element) {
  return getRoute({
    id: 'profile-' + element.id,
    renderScene: function (navigator) {
      let Profile = require('../screens/Profile');
      return <Profile navigator={navigator} element={element} />;
    },
    getTitle() {
      return element.identifier;
    }
  });
};

routes.getMyAccount = function () {
  return getRoute({
    id: 'my-account',
    getSceneClass: function () {
      return require('../views/MyAccountView');
    },
    getTitle: function () {
      return 'My Account';
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};

routes.getDiscussion = function (id) {
  return getRoute({
    id: 'discussion-' + id,
    renderScene: function (navigator) {
      let DiscussionScene = require('../screens/Discussion');
      return <DiscussionScene navigator={navigator} id={this.id} />;
    },
    getTitle: function () {
      return this.id;
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};

routes.getNavigator = function (initialRoute) {
  // navigator id === initialRoute id
  var id = 'nav-' + initialRoute.id;
  if (!navigators[id]) {
    navigators[id] = {
      id: id,
      alreadyFocused: false,
      renderScene: function (navigator) {
        return (
          <ExNavigator
            navigator={navigator}
            initialRoute={initialRoute}
            sceneStyle={{ paddingTop: navigationBarHeight }}
            />
        );
      },
      onWillFocus: function (event) {
        currentNavigator = navigators[id];

        // close drawer on routing
        if (drawer && drawerOpened === true) {
          drawer.close();
        }

        // find currently focused route
        if (!navigators[id].scene) {
          // navigator is not already mounted (onWILLFocus)
          return initialRoute.onWillFocus();
        } else {
          var nav = navigators[id].scene.__navigator;
          var route = nav.state.routeStack[nav.state.presentedIndex];
          route.onWillFocus();
        }
      },
      onDidFocus: function (event) {
        // exNavigator trigger first focus on navigator AND on initialRoute
        // for next focus only navigator is triggered
        if (!this.alreadyFocused) {
          this.alreadyFocused = true;
          return;
        }

        // find currently focused route
        var nav = navigators[id].scene.__navigator;
        var route = nav.state.routeStack[nav.state.presentedIndex];
        route.onDidFocus();
      }
    };
  }
  return navigators[id];
};

routes.RootNavigator = React.createClass({
  componentDidMount () {
    rootNavigator = this.refs.navigator;
    drawer = this.refs.drawer;
  },
  render () {
    var Navigation = require('../navigation/NavigationView');
    var initialRoute = currentNavigator = routes.getNavigator(routes.getHome());
    return (
      <Drawer
        ref="drawer"
        content={<Navigation getRootNavigator={() => rootNavigator } />}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}}}
        openDrawerOffset={50}
        onOpen={() => drawerOpened = true }
        onClose={() => drawerOpened = false }
        >
        <ExNavigator
          ref='navigator'
          showNavigationBar={false}
          initialRoute={initialRoute}
          style={{ flex: 1 }}
          />
      </Drawer>
    );
  }
});

routes.switchTo = function (route) {
  _pushOrJumpTo(rootNavigator.__navigator, routes.getNavigator(route));
};

var styles = StyleSheet.create({
  titleName: {
  },
  titlePhoto: {
    width: 50,
    height: 50,
  },
});

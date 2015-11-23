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
var app = require('./app');

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
      if (this._onWillFocus) {
        this._onWillFocus();
      }
    },
    onDidFocus: function () {
      currentRoute = this;
      _.defer(() => {
        console.log('Screen ' + currentNavigator.id + '/' + currentRoute.id + ' is now focused');
        _logCurrentStack();
        if (this._onDidFocus) {
          this._onDidFocus();
        }
      });
    },
    onWillBlur: function () {
      if (this._onWillBlur) {
        this._onWillBlur();
      }
    },
    onDidBlur: function () {
      _.defer(() => {
        if (this._onDidBlur) {
          this._onDidBlur();
        }
      });
    }
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
}

var currentUser = require('../models/current-user');
var {
  Icon
} = require('react-native-icons');
var LeftNavigation = React.createClass({
  getInitialState () {
    return {
      unviewed: currentUser.get('unviewed')
    };
  },
  componentDidMount () {
    currentUser.on('change:unviewed', (model, value) => this.setState({
      unviewed: value
    }), this);
  },
  componentWillMount () {
    currentUser.off(null, null, this);
  },
  render () {
    var unviewed = (this.state.unviewed === true)
      ? (<Icon name='fontawesome|circle' size={14} color='#fc2063' style={styles.unviewed} />)
      : null;

    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={this.onPress}
        style={ExNavigator.Styles.barLeftButton} >
        <Icon name='fontawesome|bars' size={25} style={styles.toggle} />
        {unviewed}
      </TouchableOpacity>
    );
  },
  onPress () {
    if (drawerOpened) {
      drawer.close();
    } else {
      drawer.open();
    }
  }
});

routes.getHome = function () {
  return getRoute({
    id: 'home',
    getSceneClass: function () {
      return require('../screens/Home');
    },
    getTitle: function () {
      return 'Découvrir';
    },
    configureScene: function () {
      return ExNavigator.SceneConfigs.FloatFromRight;
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};
routes.getSearch = function () {
  return getRoute({
    id: 'search',
    getSceneClass: function () {
      return require('../screens/Search');
    },
    getTitle: function () {
      return 'Chercher';
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
      return require('../screens/MyAccount');
    },
    getTitle: function () {
      return 'My Account';
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};
routes.getMyAccountEmail = function () {
  return getRoute({
    id: 'my-account-email',
    getSceneClass: function () {
      return require('../views/MyAccountEmail');
    },
    getTitle: function () {
      return 'My Email';
    }
  });
};
routes.getMyAccountEmails = function () {
  return getRoute({
    id: 'my-account-emails',
    getSceneClass: function () {
      return require('../views/MyAccountEmails');
    },
    getTitle: function () {
      return 'My Emails';
    }
  });
};
routes.getMyAccountPassword = function () {
  return getRoute({
    id: 'my-account-password',
    getSceneClass: function () {
      return require('../views/MyAccountPassword');
    },
    getTitle: function () {
      return 'My Password';
    }
  });
};
routes.getMyAccountProfile = function () {
  return getRoute({
    id: 'my-account-profile',
    getSceneClass: function () {
      return require('../views/MyAccountProfile');
    },
    getTitle: function () {
      return 'My Profile';
    }
  });
};
routes.getMyAccountInformation = function () {
  return getRoute({
    id: 'my-account-informations',
    getSceneClass: function () {
      return require('../views/MyAccountInformation');
    },
    getTitle: function () {
      return 'My Informations';
    }
  });
};
routes.getMyAccountPreferences = function () {
  return getRoute({
    id: 'my-account-preferences',
    getSceneClass: function () {
      return require('../views/MyAccountPreferences');
    },
    getTitle: function () {
      return 'My Preferences';
    }
  });
};
routes.getDiscussion = function (id, model) {
  return getRoute({
    id: 'discussion-' + id,
    renderScene: function (navigator) {
      let Discussion = require('../screens/Discussion');
      return <Discussion navigator={navigator} model={model} />;
    },
    getTitle: function () {
      return model.get('identifier');
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    },
    _onDidFocus: function () {
      console.log('pouet');
      this.scene.refs.events.onFocus();
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
  toggle: {
    width: 24,
    height: 24,
    // ExNavigator.Styles.barLeftButtonText
    fontSize: 18,
    marginLeft: 10,
    paddingVertical: 20
  },
  unviewed: {
    position: 'absolute',
    top: 5,
    left: 28,
    width: 13,
    height: 13,
  }
});

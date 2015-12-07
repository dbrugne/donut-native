'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity,
  StatusBarIOS
} = React;
var {
  Icon
} = require('react-native-icons');

var _ = require('underscore');
var debug = require('../libs/debug')('navigation');
var Drawer = require('react-native-drawer')
import ExNavigator from '@exponent/react-native-navigator';
var app = require('./app');
var Platform = require('Platform');
var currentUser = require('../models/mobile-current-user');

let navigationBarHeight = ((Platform.OS === 'android')
  ? 56
  : 64);
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
  if (route.id && knownRoutes[route.id]) {
    return knownRoutes[route.id];
  }

  var _route = _.defaults(route, _.clone({
    __type: 'route',
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
        debug.log('Screen ' + currentNavigator.id + '/' + currentRoute.id + ' is now focused');
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
    },
    renderBackButton: function (navigator) {
      return (
        <TouchableOpacity
          touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
          onPress={() => navigator.pop()}
          style={ExNavigator.Styles.barLeftButton} >
          <Icon name='fontawesome|angle-left' size={25} style={styles.backButton} />
        </TouchableOpacity>
      );
    }
  }));

  // only if view should be singletoned
  if (route.id) {
    knownRoutes[route.id] = _route;
  }

  return _route;
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

function _popNicelyToHome (navigator, index) {
  // already on home?
  if (navigator.state.presentedIndex === 0) {
    _popNicely(navigator, index);
  }

  // transition to home (index:0)
  var popIndex = 0;
  navigator._enableScene(popIndex);
  navigator._emitWillFocus(navigator.state.routeStack[popIndex]);
  navigator._transitionTo(
    popIndex,
    null, // default velocity
    null, // no spring jumping
    () => _popNicely(navigator, index)
  );
}

function _popNicely (navigator, index) {
  if (index === 0) {
    return;
  }
  // Remove any unneeded rendered routes.
  var configStack = navigator.state.sceneConfigStack;
  configStack.splice(index, 1);
  var routeStack = navigator.state.routeStack;
  var poppedRoute = routeStack.splice(index, 1)[0];
  navigators = _.omit(navigators, poppedRoute.id);
  navigator.setState({
    sceneConfigStack: configStack,
    routeStack: routeStack
  });
}

routes.removeDiscussionRoute = function (id, model) {
  var route = routes.getNavigator(routes.getDiscussion(id));
  var existingRoute = rootNavigator.getCurrentRoutes().find((element) => element === route);
  if (!existingRoute) {
    return; // view is not mounted, no op
  }

  var existingRouteIndex = rootNavigator.getCurrentRoutes().indexOf(existingRoute);
  var navigator = rootNavigator.__navigator;
  var presentedIndex = navigator.state.presentedIndex;
  var isFocused = (presentedIndex === existingRouteIndex);
  if (isFocused) {
    _popNicelyToHome(navigator, existingRouteIndex);
  } else {
    _popNicely(navigator, existingRouteIndex);
  }
}

function _logCurrentStack () {
  return;
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
      stack += '\n    \u00BB ' + ((r.getTitle) ? r.getTitle() : r.id);
      if (r.id === currentRoute.id) {
        stack += ' *';
      }
    });
  });
  debug.log(stack);
}

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
  componentWillUnmount () {
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
        <Icon name='fontawesome|clone' size={22} style={styles.toggle} />
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
routes.getRoomCreate = function () {
  return getRoute({
    id: 'create-room',
    getSceneClass: function () {
      return require('../screens/RoomCreate');
    },
    getTitle: function () {
      return 'Create a donut';
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
routes.getMyAccountEmail = function (email, func) {
  return getRoute({
    id: 'my-account-email',
    renderScene: function (navigator) {
      let EmailMain = require('../views/MyAccountEmail');
      return <EmailMain navigator={navigator} func={func} email={email} />;
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
routes.getMyAccountEmailsAdd = function (func) {
  return getRoute({
    id: 'my-account-emails-add',
    renderScene: function (navigator) {
      let EmailAdd = require('../views/MyAccountEmailsAdd');
      return <EmailAdd navigator={navigator} func={func} />;
    },
    getTitle: function () {
      return 'Add an email';
    }
  });
};
routes.getMyAccountEmailEdit = function (element, func) {
  return getRoute({
    id: 'edit-email-' + element.email,
    renderScene: function (navigator) {
      let EmailEdit = require('../views/MyAccountEmailEdit');
      return <EmailEdit navigator={navigator} email={element} func={func} />;
    },
    getTitle() {
      return 'Manage email';
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
routes.getColorPicker = function () {
  return getRoute({
    id: 'color-picker',
    getSceneClass: function () {
      return require('../views/ColorPicker');
    },
    getTitle: function () {
      return 'Color picker';
    }
  });
};
routes.getDiscussionSettings = function (id, model) {
  return getRoute({
    id: 'discussion-settings-' + id,
    renderScene: function (navigator) {
      let Settings = require('../views/DiscussionSettings');
      return <Settings navigator={navigator} model={model} />;
    },
    getTitle: function () {
      return 'Settings';
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
    renderRightButton: function (navigator) {
      return (
        <TouchableOpacity
          touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
          onPress={() => navigator.push(routes.getDiscussionSettings(id, model))}
          style={ExNavigator.Styles.barRightButton} >
          <Icon name='fontawesome|cog' size={25} style={styles.settings} />
        </TouchableOpacity>
      );
    },
    _onDidFocus: function () {
      // delay history load to avoid transition impact (visibly onDidFocus is triggered before transition end)
      setTimeout(() => this.scene.refs.events.onFocus(), 100);
    }
  });
};
routes.getUserFieldEdit = function (data) {
  return getRoute({
    renderScene: function (navigator) {
      return (<data.component navigator={navigator} data={data} />);
    },
    getTitle: function () {
      return 'Change a value';
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
            style={{flex: 1}}
            sceneStyle={{ paddingTop: navigationBarHeight }}
            titleStyle={{
              fontSize: 20,
              color: '222',
              alignSelf: 'center',
              marginTop: 15
            }}
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
routes.switchTo = function (route) {
  if (!_.isObject(route) || route.__type !== 'route') {
    return debug.log('switchTo expect a route object');
  }
  _pushOrJumpTo(rootNavigator.__navigator, routes.getNavigator(route));
};

routes.RootNavigator = React.createClass({
  componentDidMount () {
    rootNavigator = this.refs.navigator;
    drawer = this.refs.drawer;
    debug.log('mount RootNavigator');
  },
  componentWillUnmount () {
    // reset navigation state (@logout)
    drawer = null;
    drawerOpened = false;
    rootNavigator = null;
    navigators = {};
    knownRoutes = {};
    currentNavigator = null;
    currentRoute = null;

    debug.log('unmount RootNavigator');
  },
  render () {
    var Navigation = require('../navigation/NavigationView');
    var initialRoute = currentNavigator = routes.getNavigator(routes.getHome());
    return (
      <Drawer
        ref='drawer'
        content={<Navigation getRootNavigator={() => rootNavigator } />}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 3}}}
        openDrawerOffset={50}
        onOpen={this.onDrawerOpen}
        onClose={this.onDrawerClose}
        >
        <ExNavigator
          ref='navigator'
          showNavigationBar={false}
          initialRoute={initialRoute}
          style={{ flex: 1 }}
          />
      </Drawer>
    );
  },
  onDrawerOpen () {
    debug.log('onDrawerOpen');
    drawerOpened = true;
    if (Platform.OS === 'ios') {
      StatusBarIOS.setHidden(true, 'slide');
    }
  },
  onDrawerClose () {
    debug.log('onDrawerClose');
    drawerOpened = false;
    if (Platform.OS === 'ios') {
      StatusBarIOS.setHidden(false, 'slide');
    }
  }
});

var styles = StyleSheet.create({
  titleName: {
    alignSelf: 'center'
  },
  titlePhoto: {
    width: 50,
    height: 50,
  },
  toggle: {
    width: 22,
    height: 22,
    // ExNavigator.Styles.barLeftButtonText
    fontSize: 18,
    marginLeft: 10,
    paddingVertical: 20
  },
  settings: {
    width: 24,
    height: 24,
    fontSize: 18,
    marginRight: 10,
    paddingVertical: 20
  },
  backButton: {
    width: 24,
    height: 24,
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

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBarIOS
} = React;
var {
  Icon
} = require('react-native-icons');

// @todo : refactor to route class + component + helper

var _ = require('underscore');
var debug = require('../libs/debug')('navigation');
var Drawer = require('react-native-drawer');
import ExNavigator from '@exponent/react-native-navigator';
var app = require('./app');
var Platform = require('Platform');
var currentUser = require('../models/current-user');
var i18next = require('../libs/i18next');
var dismissKeyboard = require('dismissKeyboard');

// @debug
var currentFocused = function () {
  var list = [];
  var iterator = function (m) {
    if (m.get('focused')) {
      list.push(m.get('identifier'));
    }
  };

  app.rooms.each(iterator);
  app.ones.each(iterator);
  app.groups.each(iterator);
  return list.join(', ');
};
app.on('focusModelChanged', function () {
  debug.log('[FOCUSED] now focused view is: ', currentFocused());
});
// @debug

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
      // route.model is null for non discussion views
      app.setFocusedModel(route.model);

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
    renderTitle () {
      let title = route.getTitle();
      title = title.length > 18 ? title.substr(0, 18) + '…' : title;
      return (
        <View style={{alignSelf: 'center'}}>
          <Text style={{fontFamily: '.HelveticaNeueInterface-MediumP4', fontSize: 16, color: '222', fontWeight: 'bold'}}>
            {title}
          </Text>
        </View>
      );
    },
    onBack: function () {
      if (drawerOpened) {
        return drawer.close();
      }

      var baseRoute = ['home', 'my-account', 'search', 'create-room', 'create-group', 'notification-center'];
      var isDiscussion = (currentRoute && currentRoute.model && (currentRoute.model.get('type') === 'onetoone' || currentRoute.model.get('type') === 'room'));
      if (baseRoute.indexOf(currentRoute.id) !== -1 || isDiscussion) {
        return drawer.open();
      }
      this.scene.props.navigator.pop();
    },
    renderBackButton: function (navigator) {
      return (
        <TouchableOpacity
          touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
          onPress={() => navigator.pop()}
          style={ExNavigator.Styles.barBackButton} >
          <Icon name='fontawesome|angle-left'
                size={18}
                color='#fc2063'
                style={[ExNavigator.Styles.barButtonIcon, {marginLeft: 5, width: 18, height: 18}, Platform.OS === 'android' ? {marginTop: 18} : {marginTop: 12} ]} />
          <Text style={[ExNavigator.Styles.barButtonText, {color: '#fc2063'}, Platform.OS === 'android' ? {marginTop: 16} : {marginTop: 11} ]}> {i18next.t('navigation.back')}</Text>
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
  var _route = (!model.get('blocked'))
    ? routes.getDiscussion(id, model)
    : routes.getBlockedDiscussion(id, model);
  var route = routes.getNavigator(_route);
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
};

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
      stack += '\n    \u00BB ' + ((r.getTitle) ? r.getTitle() : r.id);
      if (r.id === currentRoute.id) {
        stack += ' *';
      }
    });
  });
  debug.log(stack);
}

routes.getFocusedRoute = function () {
  return currentRoute;
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
        style={ExNavigator.Styles.barBackButton} >
        <Icon name='fontawesome|bars'
              size={25}
              color='#fc2063'
              style={[{marginLeft: 16, width:22, height:22}, Platform.OS === 'android' ? {marginTop: 14} : {marginTop: 11} ]} />
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

routes.getEutc = function () {
  return getRoute({
    id: 'eutc',
    renderScene: function (navigator) {
      let Eutc = require('../loggedOut/eutc');
      return <Eutc navigator={navigator} fromNavigation={true}/>;
    },
    getTitle: function () {
      return i18next.t('navigation.eutc');
    }
  });
};
routes.getHome = function () {
  return getRoute({
    id: 'home',
    getSceneClass: function () {
      return require('../screens/Home');
    },
    getTitle: function () {
      return i18next.t('navigation.discover');
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
      return i18next.t('navigation.search');
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
      return require('../screens/RoomCreation');
    },
    getTitle: function () {
      return i18next.t('navigation.create-donut');
    },
    configureScene: function () {
      return ExNavigator.SceneConfigs.FloatFromRight;
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};
routes.getGroupCreate = function () {
  return getRoute({
    id: 'create-group',
    getSceneClass: function () {
      return require('../screens/GroupCreate');
    },
    getTitle: function () {
      return i18next.t('navigation.create-group');
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

routes.getGroup = function (element) {
  return getRoute({
    id: 'group-home',
    renderScene: function (navigator) {
      let GroupHome = require('../screens/Group');
      return <GroupHome navigator={navigator} element={element} />;
    },
    getTitle: function () {
      return '#' + element.name;
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};
routes.getGroupRoomsList = function (element) {
  return getRoute({
    id: 'group-rooms-list' + element.user.isMember,
    renderScene: function (navigator) {
      let GroupRoomsList = require('../views/GroupRoomsList');
      return <GroupRoomsList navigator={navigator} id={element.id} user={element.user} />;
    },
    getTitle: function () {
      return element.name;
    }
  });
};
routes.getGroupAskMembership = function (id) {
  return getRoute({
    id: 'group-ask-membership' + id,
    renderScene: function (navigator) {
      let GroupAskMembership = require('../views/GroupAsk');
      return <GroupAskMembership navigator={navigator} id={id}/>;
    },
    getTitle: function () {
      return i18next.t('navigation.ask-membership');
    }
  });
};
routes.getGroupAskMembershipRequest = function (element) {
  return getRoute({
    id: 'group-ask-membership-request' + element.id + '-' + element.isAllowedPending,
    renderScene: function () {
      let GroupAskMembershipRequest = require('../views/GroupAskRequest');
      return <GroupAskMembershipRequest id={element.id} isAllowedPending={element.isAllowedPending} scroll />;
    },
    getTitle: function () {
      return i18next.t('navigation.ask-membership-request');
    }
  });
};
routes.getGroupAskMembershipPassword = function (id) {
  return getRoute({
    id: 'group-ask-membership-password' + id,
    renderScene: function (navigator) {
      let GroupAskMembershipPassword = require('../views/GroupAskPassword');
      return <GroupAskMembershipPassword navigator={navigator} id={id} scroll />;
    },
    getTitle: function () {
      return i18next.t('navigation.ask-membership-password');
    }
  });
};
routes.getGroupAskMembershipEmail = function (element) {
  return getRoute({
    id: 'group-ask-membership-email' + element.id,
    renderScene: function () {
      let GroupAskMembershipEmail = require('../views/GroupAskEmail');
      return <GroupAskMembershipEmail id={element.id} domains={element.domains} scroll />;
    },
    getTitle: function () {
      return i18next.t('navigation.ask-membership-email');
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
      return i18next.t('navigation.my-account');
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};
routes.getMyAccountEmail = function (email, func) {
  return getRoute({
    id: 'my-account-email' + email,
    renderScene: function (navigator) {
      let EmailMain = require('../views/MyAccountEmail');
      return <EmailMain navigator={navigator} func={func} email={email} />;
    },
    getTitle: function () {
      return i18next.t('navigation.my-email');
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
      return i18next.t('navigation.my-emails');
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
      return i18next.t('navigation.add-email');
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
      return i18next.t('navigation.manage-email');
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
      return i18next.t('navigation.my-password');
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
      return i18next.t('navigation.my-informations');
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
      return i18next.t('navigation.my-preferences');
    }
  });
};
routes.getAbout = function () {
  return getRoute({
    id: 'about',
    getSceneClass: function () {
      return require('../views/About');
    },
    getTitle: function () {
      return i18next.t('navigation.about');
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
      return i18next.t('navigation.color-picker');
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
      return i18next.t('navigation.settings');
    }
  });
};

routes.getDiscussion = function (id, model) {
  return getRoute({
    id: 'discussion-' + id,
    model: model, // only for discussion routes
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
          <Icon color='#fc2063' name='fontawesome|cog' size={25} style={styles.settings} />
        </TouchableOpacity>
      );
    },
    _onDidFocus: function () {
      // delay heavy processing logic (e.g. history fetching and rendering) to
      // avoid animation leak (visibly onDidFocus is triggered before transition end)
      setTimeout(() => {
        this.scene.onFocus();
      }, 100);
    }
  });
};
routes.getBlockedDiscussion = function (id, model) {
  return getRoute({
    id: 'discussion-blocked-' + id,
    renderScene: function (navigator) {
      let DiscussionBlocked = require('../screens/DiscussionBlocked');
      return <DiscussionBlocked navigator={navigator} model={model} />;
    },
    getTitle: function () {
      return model.get('identifier');
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    }
  });
};
routes.getUpdateRoomTopic = function (id) {
  return getRoute({
    id: 'room-topic' + id,
    renderScene: function () {
      let UpdateRoomTopic = require('../views/UpdateRoomTopic');
      return <UpdateRoomTopic id={id} />;
    },
    getTitle: function () {
      return i18next.t('navigation.update-room-topic');
    }
  });
};
routes.getRoomUsers = function (id, model) {
  return getRoute({
    id: 'room-users-' + id,
    renderScene: function (navigator) {
      let RoomUsers = require('../views/RoomUsers');
      return <RoomUsers navigator={navigator} model={model} />;
    },
    getTitle: function () {
      return i18next.t('navigation.room-users');
    }
  });
};
routes.getManageUser = function (roomId, user, fc) {
  return getRoute({
    id: 'manage-user-' + user.user_id,
    renderScene: function (navigator) {
      let RoomUsers = require('../views/ManageUser');
      return <RoomUsers navigator={navigator} user={user} roomId={roomId} fc={fc}/>;
    },
    getTitle: function () {
      return i18next.t('navigation.manage-user');
    }
  });
};
routes.getUserFieldEdit = function (data) {
  return getRoute({
    renderScene: function (navigator) {
      return (<data.component navigator={navigator} data={data} />);
    },
    getTitle: function () {
      return i18next.t('navigation.change-value');
    }
  });
};
routes.getNotifications = function () {
  return getRoute({
    id: 'notification-center',
    getSceneClass: function () {
      return require('../screens/Notifications');
    },
    getTitle() {
      return i18next.t('navigation.notifications');
    },
    renderLeftButton: function (navigator) {
      return (<LeftNavigation navigator={navigator} />);
    },
    _onDidFocus: function () {
      // delay heavy processing logic (e.g. history fetching and rendering) to
      // avoid animation leak (visibly onDidFocus is triggered before transition end)
      setTimeout(() => {
        this.scene.onFocus();
      }, 100);
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
      focused: false,
      renderScene: function (navigator) {
        return (
          <ExNavigator
            navigator={navigator}
            initialRoute={initialRoute}
            style={{flex: 1}}
            sceneStyle={{ paddingTop: navigationBarHeight }}
            />
        );
      },
      onWillFocus: function (event) {
        this.focused = true;
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
        this.focused = true;
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
      },
      onWillBlur: function (event) {
        this.focused = false;
        // find currently focused route
        var nav = navigators[id].scene.__navigator;
        var route = nav.state.routeStack[nav.state.presentedIndex];
        route.onWillBlur();
      },
      onDidBlur: function (event) {
        this.focused = false;
        // find currently focused route
        var nav = navigators[id].scene.__navigator;
        var route = nav.state.routeStack[nav.state.presentedIndex];
        route.onDidBlur();
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
routes.openDrawer = function () {
  drawer.open();
};
routes.RootNavigator = React.createClass({
  getInitialState: function () {
    return {
      status: currentUser.get('status')
    };
  },
  componentDidMount () {
    rootNavigator = this.refs.navigator;
    drawer = this.refs.drawer;
    debug.log('mount RootNavigator');
    currentUser.on('change:status', () => {
      this.setState({status: currentUser.get('status')});
    });
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
    currentUser.off('change:status');

    debug.log('unmount RootNavigator');
  },
  render () {
    var Navigation = require('../navigation/components/DrawerContent');
    var initialRoute = currentNavigator = routes.getNavigator(routes.getHome());
    return (
      <Drawer
        ref='drawer'
        content={<Navigation getRootNavigator={() => rootNavigator } />}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 3}}}
        openDrawerOffset={50}
        panOpenMask={0}
        panCloseMask={50}
        tapToClose={true}
        captureGestures={true}
        onOpen={this.onDrawerOpen}
        onClose={this.onDrawerClose}
        tweenHandler={(ratio) => {
                    return {
                        drawer: { shadowRadius: Math.min(ratio*5*5, 5) },
                        main: { opacity:(2-ratio)/2 },
                    }
                }}
        >
        <ExNavigator
          ref='navigator'
          showNavigationBar={false}
          initialRoute={initialRoute}
          style={{ flex: 1 }}
          />
        {
          (this.state.status === 'offline')
            ? <View style={{
              height: 30,
              backgroundColor: '#F00',
              position: 'absolute',
              top: navigationBarHeight,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text style={{color: '#FFF'}}>{this.state.status}</Text></View>
            : (this.state.status === 'connecting')
              ? <View style={{
                height: 30,
                backgroundColor: '#FA0',
                position: 'absolute',
                top: navigationBarHeight,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center'}}>
            <Text style={{color: '#FFF'}}>{this.state.status}</Text></View>
            : null
        }
      </Drawer>
    );
  },
  onDrawerOpen () {
    dismissKeyboard();
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
    height: 50
  },
  toggle: {
    width: 22,
    height: 22,
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
    top: 8,
    left: 30,
    width: 13,
    height: 13
  }
});

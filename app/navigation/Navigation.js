'use strict';

var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  TouchableOpacity,
  View,
  Component,
  StatusBarIOS,
  StatusBarAnimation
} = React;

var app = require('../libs/app');
var rooms = require('../collections/rooms');
var onetoones = require('../collections/onetoones');
var Drawer = require('react-native-drawer');
var router = require('./Router');
var NavigationBarView = require('./NavigationBar');
var NavigationView = require('./NavigationView');

class Container extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    var _component = this.props.route.component;
    return (
      <View style={[styles.scene, this.props.navBarHidden && styles.sceneHidden]}>
        <_component ref="mainComponent"
                   navigator={this.props.navigator}
                   currentRoute={this.props.route}
                   {...this.props.route.passProps}
          />
      </View>
    );
  }
}

class Navigation extends Component {
  constructor (props) {
    super(props);
    this.drawerOpened = false;
  }

  componentDidMount () {
    app.on('navigateTo', this.navigateTo.bind(this));
    app.on('toggleDrawer', this.toggleDrawer.bind(this));
  }

  componentWillUnmount () {
    app.off('navigateTo');
    app.off('toggleDrawer');
  }

  renderNavBar () {
//    if (this.props.navBarHidden) {
//      return null;
//    }
    return NavigationBarView;
  }

  render () {
    return (
      <Drawer
        type='static'
        ref='drawer'
        content={<NavigationView />}
        openDrawerOffset={100}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}}}
        tweenHandler={Drawer.tweenPresets.parallax}
        onOpen={this.onOpenDrawer.bind(this)}
        onClose={this.onCloseDrawer.bind(this)}
        >
        <View style={styles.appContainer}>
          <Navigator
            ref='navigator'
            // debugOverlay={false}
            initialRoute={router('home')}
            renderScene={this.renderScene}
            // navBarHidden={this.props.navBarHidden}
            // initialRouteStack={this.props.routeStack.path}
            navigationBar={this.renderNavBar()}
            onDidFocus={this.onFocus.bind(this)}
            configureScene={this.configureScene}
            />
        </View>
      </Drawer>
    );
  }

  renderScene (route, navigator) {
    return (
      <Container
        route={route}
        navigator={navigator}
        {...this.props}
        />
    );
  }

  // @source: https://rnplay.org/apps/HPy6UA
  configureScene (route) {
    return Object.assign({}, Navigator.SceneConfigs.FloatFromRight, {
      springTension: 100,
      springFriction: 1
    });
  }

  onFocus (route) {
    // unfocus all
    rooms.each(function (o) {
      o.set('focused', false);
    });
    onetoones.each(function (o) {
      o.set('focused', false);
    });

    // focus
    if (route && route.model) {
      route.model.set('focused', true);
    }
  }

  onOpenDrawer () {
    this.drawerOpened = true;
    if (StatusBarIOS) {
      StatusBarIOS.setHidden(true, 'slide');
    }
  }

  onCloseDrawer () {
    this.drawerOpened = false;
    if (StatusBarIOS) {
      StatusBarIOS.setHidden(false, 'slide');
    }
  }

  closeDrawer () {
    this.refs.drawer.close();
  }

  toggleDrawer () {
    if (this.drawerOpened) {
      this.refs.drawer.close();
    } else {
      this.refs.drawer.open();
    }
  }

  navigateTo (url, options) {
    if (!this.refs.navigator) {
      return;
    }

    console.log('route to', url);
    var route = router(url, options);
    console.log('get =>', route);
    if (!route) {
      return;
    }

    var routes = this.refs.navigator.getCurrentRoutes();
    var existingRoute = routes.filter((r) => (r.url === route.url))[ 0 ];
    console.log('exists =>', !!(existingRoute));
    if (existingRoute) {
      this.refs.navigator.jumpTo(existingRoute);
    } else {
      this.superPush(route);
    }
    this.closeDrawer();
    console.log(require('underscore').map(this.refs.navigator.getCurrentRoutes(), (r) => r.title))
//    console.log(this.refs.navigator.getCurrentRoutes())
  }

  superPush (route) {
    // @source : react-native/Libraries/CustomComponents/Navigator/Navigator.js:891
    var navigator = this.refs.navigator;
//    invariant(!!route, 'Must supply route to push');
//    var activeLength = navigator.state.presentedIndex + 1;
//    var activeStack = navigator.state.routeStack.slice(0, activeLength);
//    var activeAnimationConfigStack = navigator.state.sceneConfigStack.slice(0, activeLength);
    var activeStack = navigator.state.routeStack; // @hack
    var activeAnimationConfigStack = navigator.state.sceneConfigStack; // @hack
    var nextStack = activeStack.concat([route]);
    var destIndex = nextStack.length - 1;
    var nextAnimationConfigStack = activeAnimationConfigStack.concat([
      navigator.props.configureScene(route),
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
}

var styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  scene: {
    flex: 1,
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    backgroundColor: '#FFFFFF'
  },
  sceneHidden: {
    marginTop: 0
  }
});


module.exports = Navigation;

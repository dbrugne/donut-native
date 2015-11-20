'use strict';

var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  View,
  Component,
  Text
  } = React;

var _ = require('underscore');
var app = require('../libs/app');
var router = require('../navigation/Router');
var rooms = require('../collections/rooms');
var onetoones = require('../collections/onetoones');
var NavigationBarView = require('./NavigationBar');

function onRouteFocused (route, parentNavigator) {
  logStack(parentNavigator);

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

function logStack (parentNavigator) {
  if (!parentNavigator) {
    return console.log('no navigator!');
  }

  console.log(_.map(parentNavigator.getCurrentRoutes(), 'id'));
}

class StackContainer extends Component {
  constructor (props) {
    super(props);
  }
  componentDidMount () {
    this.refs.childNavigator.navigationContext.addListener('didfocus', (event) => {
      onRouteFocused(event.data.route, this.props.navigator);
    });
  }
  componentWillUnmount () {
    // @todo unbind
  }
  render () {
    return (
      <Navigator
        ref='childNavigator'
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator}
        initialRoute={this.props.stackInitialRoute}
        navigationBar={this.renderNavBar()}
        />
    );
  }
  renderScene (route, navigator) {
    var _component = route.component;
    navigator.xurl = route.url;
    return (
      <_component
        ref='mainComponent'
        parentNavigator={this.props.navigator}
        childNavigator={navigator}
        currentRoute={route}
        style={styles.scene}
        />
    );
  }
  renderNavBar () {
    return NavigationBarView;
  }
}

class DonutNavigator extends Component {
  constructor (props) {
    super(props);
  }
  componentDidMount () {
    app.on('switchToNavigationStack', this.switchToNavigationStack.bind(this));
    this.refs.navigator.navigationContext.addListener('didfocus', (event) => {
      onRouteFocused(event.data.route, this.refs.navigator);
    });
  }
  componentWillUnmount () {
    app.off('switchToNavigationStack');
    // @todo unbind
  }
  render () {
    return (
      <Navigator
        style={styles.parentNavigator}
        ref='navigator'
        initialRoute={router.getStackRoute(router.getRoute('home'))}
        renderScene={this.renderScene.bind(this)}
        configureScene={() => Navigator.SceneConfigs.FloatFromRight}
        />
    );
  }
  renderScene (stackRoute, navigator) {
    return (
      <StackContainer
        stackInitialRoute={stackRoute.initialRoute}
        navigator={navigator}
        />
    );
  }
  switchToNavigationStack (url, options) {
    if (!this.refs.navigator) {
      return console.log('no parentNavigator');
    }

    var route = router.getRoute(url, options);
    //    console.log(url, '=>', route);
    if (!route) {
      return console.log('no route');
    }
    if (!route.stackRoot) {
      return console.log('route is not a stackRoot', route);
    }
    var stackRoot = router.getStackRoute(route);

    var routes = this.refs.navigator.getCurrentRoutes();
    var existingRoute = routes.filter((r) => (r.id === stackRoot.id))[ 0 ];
    if (existingRoute) {
//      console.log('exists');
      this.refs.navigator.jumpTo(existingRoute);
      // @todo : sometines bug when jumpTo existing route. childNavigator remain the previous one
    } else {
//      console.log('not exists');
      this.addRouteStack(stackRoot);
//      this.superPush(route);
    }

    app.trigger('closeDrawer');
//    console.log('go to');
//    console.log(require('underscore').map(this.refs.parentNavigator.refs.parentNavigator.getCurrentRoutes(), (r) => r.title))
  }

  /**
   * Add pushToBottom method to Navigator
   *
   * @source : react-native/Libraries/CustomComponents/Navigator/Navigator.js:891
   * @param route
   */
  addRouteStack (stackRoot) {
    var navigator = this.refs.navigator;

    var activeStack = navigator.state.routeStack;
    var activeAnimationConfigStack = navigator.state.sceneConfigStack;
    var nextStack = activeStack.concat([stackRoot]);
    var destIndex = nextStack.length - 1;
    var nextAnimationConfigStack = activeAnimationConfigStack.concat([
      navigator.props.configureScene(stackRoot)
    ]);
    navigator._emitWillFocus(nextStack[destIndex]);
    navigator.setState({
      routeStack: nextStack,
      sceneConfigStack: nextAnimationConfigStack,
    }, () => {
      navigator._enableScene(destIndex);
      navigator._transitionTo(destIndex);
    });
  };
}

var styles = StyleSheet.create({
  parentNavigator: {
    flex: 1
  },
  scene: {
    flex: 1,
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight
  }
});

module.exports = DonutNavigator;

//  navigateTo (url, options) {
//    return;
//    if (!this.refs.mainNavigator) {
//      return;
//    }
//
//    console.log('route to', url);
//    var route = router.getRoute(url, options);
//    console.log('get =>', route);
//    if (!route) {
//      return;
//    }
//
//    var routes = this.refs.mainNavigator.getCurrentRoutes();
//    var existingRoute = routes.filter((r) => (r.url === route.url))[ 0 ];
//    console.log('exists =>', !!(existingRoute));
//    if (existingRoute) {
//      this.refs.mainNavigator.jumpTo(existingRoute);
//    } else {
////      this.refs.mainNavigator.push(route);
//      this.superPush(route);
//    }
//    this.closeDrawer();
//    console.log(require('underscore').map(this.refs.mainNavigator.getCurrentRoutes(), (r) => r.title))
//  }

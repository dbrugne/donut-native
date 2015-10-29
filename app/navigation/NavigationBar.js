var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  TouchableOpacity,
  View,
  Component
} = React;

var NavigatorNavigationBarStyles = Navigator.NavigationBar.StylesIOS;//require('NavigatorNavigationBarStyles');
var NavigationBarRouteMapper     = require('./NavigationBarRouteMapper');
var app = require('../libs/app');

//var stacksEqual = function(one, two, length) {
//  if (one.length < length) return false;
//  if (two.length < length) return false;
//
//  for (var i=0; i < length; i++) {
//    if (one[i].routePath !== two[i].routePath) {
//      return false;
//    }
//  }
//  return true;
//};

var HomeView = require('../views/HomeView');
var Container = React.createClass({
  render: function() {
    var Component = this.props.route.component;
    return (
      <View
        style={[styles.scene, this.props.navBarHidden && styles.sceneHidden]}
//        ref={this.props.onLoadedScene}
      >
        <Component ref="mainComponent"
          navigator={this.props.navigator}
          currentRoute={this.props.route}
          {...this.props.route.passProps}
        />
      </View>
    );
  }
});

class NavigationBar extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    var that = this;
    app.on('navigateTo', function (route) {
      that.navigateTo(route);
    });
  }

  renderScene (route, navigator) {
    console.log('renderScene: ', route.name);

    return(
      <Container
//        ref={this.onLoadedScene}
        route={route}
        navigator={navigator}
        {...this.props}
      />
    );
  }
//  renderScene (route, navigator) {
//    return (<route.component name={route.name} navigator={navigator} />);
//  }

//  onLoadedScene (component) {
//    console.log("onLoadedScene");
//    if (component) {
//      this._currentComponent = component.refs.mainComponent;
//    }
//    else {
//      this._currentComponent = null;
//    }
//  }

//  componentDidUpdate (prevProps, prevState) {
//    var current = this.refs.navigator.getCurrentRoutes();
//
//    if (!current) return; // otherwise initial
//
//    var next = this.props.routeStack.path;
//    var currentRoute = current[current.length - 1];
//    var currentPath  = currentRoute.routePath;
//    var nextRoute    = next[next.length - 1];
//    var nextPath     = nextRoute.routePath;
//
//    if(stacksEqual(current, next, current.length)
//          && next[next.length-2]
//          && next[next.length-2].routePath === currentPath) {
//      // simple push
//      this.refs.navigator.push(nextRoute);
//    }
//    else if(stacksEqual(current, next, next.length)
//          && current[current.length-2]
//          && current[current.length-2].routePath === nextPath) {
//      // simple pop
//      this.refs.navigator.pop();
//    }
//    else if(stacksEqual(current, next, next.length-1)) {
//      // switching out last one
//      if (currentRoute.component === nextRoute.component
//          && this._currentComponent
//          && this._currentComponent.setNavigatorRoute) {
//        // switch out current one, same type
//        if (this._currentComponent.props.currentRoute) {
//          // update it in place
//          this._currentComponent.props.currentRoute = currentRoute;
//        }
//        this._currentComponent.setNavigatorRoute(nextRoute);
//      }
//      else {
//        this.refs.navigator.replace(nextRoute);
//      }
//    }
//    else {
//      // something more complicated
//      this.refs.navigator.immediatelyResetRouteStack(this.props.routeStack.path);
//    }
//  }

  renderNavBar () {
//    if (this.props.navBarHidden) {
//      return null;
//    }

    return (
      <Navigator.NavigationBar
        routeMapper={new NavigationBarRouteMapper()}
        style={styles.navBar}
      />
    );
  }

  render () {
    return (
      <View style={styles.appContainer}>
        <Navigator
          ref='navigator'
//          debugOverlay={false}
          initialRoute={{ name: 'home', title: 'home', index: 0, component: HomeView }}
          renderScene={this.renderScene.bind(this)}
//          initialRoute={{name: 'home'}}
//          renderScene={this.renderScene}
//          navBarHidden={this.props.navBarHidden}
//          initialRouteStack={this.props.routeStack.path}
          navigationBar={this.renderNavBar()}
        />
      </View>
    );
  }

  navigateTo (route) {
    if (!this.refs.navigator) {
      return;
    }

    console.log('go to ', route);
    console.log(this.refs.navigator.getCurrentRoutes());
    var _route = this.refs.navigator.getCurrentRoutes().filter((r) => (r.name === route.name))[0];
    console.log(_route);
    if (_route) {
      this.refs.navigator.jumpTo(_route);
    } else {
      this.refs.navigator.push(route);
    }
  }
}

var styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  navBar: {
    backgroundColor: '#5cafec',
    height: NavigatorNavigationBarStyles.General.TotalNavHeight
  },
  scene: {
    flex: 1,
    marginTop: NavigatorNavigationBarStyles.General.TotalNavHeight,
    backgroundColor: '#FF0000',
  },
  sceneHidden: {
    marginTop: 0
  }
});


module.exports = NavigationBar;

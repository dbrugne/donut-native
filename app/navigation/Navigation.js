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

  renderScene (route, navigator) {
    return(
      <Container
        route={route}
        navigator={navigator}
        {...this.props}
      />
    );
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
        >
        <View style={styles.appContainer} >
          <Navigator
            ref='navigator'
            // debugOverlay={false}
            initialRoute={router('home')}
            renderScene={this.renderScene}
            // navBarHidden={this.props.navBarHidden}
            // initialRouteStack={this.props.routeStack.path}
            navigationBar={this.renderNavBar()}
            onDidFocus={this.onFocus.bind(this)}
            />
        </View>
      </Drawer>
    );
  }

  onFocus (route) {
    console.log('focus me hard', route);

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

  closeDrawer () {
    this.refs.drawer.close();
    this.drawerOpened = false;
    StatusBarIOS.setHidden(false, 'slide');
  }

  toggleDrawer () {
    if (this.drawerOpened) {
      this.closeDrawer();
    } else {
      this.refs.drawer.open();
      StatusBarIOS.setHidden(true, 'slide');
      this.drawerOpened = !this.drawerOpened;
    }
  }

  navigateTo (url) {
    if (!this.refs.navigator) {
      return;
    }
    var route = router(url);
    if (!route) {
      return;
    }

    var _route = this.refs.navigator.getCurrentRoutes().filter((r) => (r.id === route.id))[0];
    if (_route) {
      this.refs.navigator.jumpTo(_route);
    } else {
      this.refs.navigator.push(route);
    }
    this.closeDrawer();
  }
}

var styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  scene: {
    flex: 1,
    marginTop: Navigator.NavigationBar.Styles.General.TotalNavHeight
  },
  sceneHidden: {
    marginTop: 0
  }
});


module.exports = Navigation;

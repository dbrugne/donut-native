var React = require('react-native');

var {
  Text,
  StyleSheet
} = React;

var app = require('../libs/app');

// Nav sample: https://github.com/facebook/react-native/blob/2b916f3ceffbcb11ed383f958823d221b3feacc6/Examples/UIExplorer/Navigator/NavigationBarSample.js
var NavigationBarRouteMapper = {

  parent: null, // @todo : ugly ?

  drawerOpened: false,

  LeftButton: function (route, navigator, index, navState) {
    return (<Text style={styles.button} route={route} index={index} navigator={navigator} direction="left" onPress={this.toggleControlPanel.bind(this)}>MENU</Text>);
  },

  RightButton: function (route, navigator, index, navState) {
    return (<Text style={styles.button} route={route} index={index} navigator={navigator} direction="right">RIGHT</Text>);
  },

  Title: function (route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title} [{index}]
      </Text>
    );
  },
  toggleControlPanel: function () {
    if (!this.parent || !this.parent.refs || !this.parent.refs.drawer) {
      return;
    }

    if (this.drawerOpened) {
      this.parent.refs.drawer.close();
    } else {
      this.parent.refs.drawer.open();
    }
    this.drawerOpened = !this.drawerOpened;
  }
};

var styles = StyleSheet.create({
  navBarTitleText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
    marginVertical: 9,
  },
});

module.exports = function (_parent) {
  NavigationBarRouteMapper.parent = _parent;
  return NavigationBarRouteMapper;
};

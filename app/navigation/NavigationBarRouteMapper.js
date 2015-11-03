var React = require('react-native');
var {
  Text,
  TouchableOpacity,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var app = require('../libs/app');

// Nav sample: https://github.com/facebook/react-native/blob/2b916f3ceffbcb11ed383f958823d221b3feacc6/Examples/UIExplorer/Navigator/NavigationBarSample.js
var NavigationBarRouteMapper = {

  parent: null, // @todo : ugly ?

  drawerOpened: false,

  LeftButton: function (route, navigator, index, navState) {
    return (
      <TouchableOpacity style={styles.leftContainer} onPress={this.toggleControlPanel.bind(this)}>
        <Icon
          name='fontawesome|bars'
          size={30}
          color='#FFFFFF'
          style={styles.navigation}
          />
      </TouchableOpacity>
    );
  },

  RightButton: function (route, navigator, index, navState) {
//    return (<Text style={styles.button} route={route} index={index} navigator={navigator} direction="right">RIGHT</Text>);
    return (
      <TouchableOpacity style={styles.rightContainer} onPress={this.toggleControlPanel.bind(this)}>
        <Icon
          name='fontawesome|hand-peace-o'
          size={30}
          color='#FFFFFF'
          style={styles.navigation}
          />
      </TouchableOpacity>
    );
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
  leftContainer: {
    paddingTop: 6,
    paddingLeft: 10
  },
  rightContainer: {
    paddingTop: 6,
    paddingRight: 10
  },
  navigation: {
    width: 30,
    height: 30,
  }
});

module.exports = function (_parent) {
  NavigationBarRouteMapper.parent = _parent;
  return NavigationBarRouteMapper;
};

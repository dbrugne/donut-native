var React = require('react-native');
var {
  Text,
  TouchableOpacity,
  StyleSheet,
  View
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
      <TouchableOpacity style={[styles.navBarText, styles.leftContainer]} onPress={this.toggleControlPanel.bind(this)}>
        <Icon
          name='fontawesome|bars'
          size={25}
          color='#5f5e63'
          style={styles.icon}
          />
      </TouchableOpacity>
    );
  },

  RightButton: function (route, navigator, index, navState) {
//    return (<Text style={styles.button} route={route} index={index} navigator={navigator} direction="right">RIGHT</Text>);
    return (
      <TouchableOpacity style={[styles.navBarText, styles.rightContainer]} onPress={this.toggleControlPanel.bind(this)}>
        <Icon
          name='fontawesome|hand-peace-o'
          size={25}
          color='#5f5e63'
          style={styles.icon}
          />
      </TouchableOpacity>
    );
  },

  Title: function (route, navigator, index, navState) {
    return (
      <View style={styles.titleContainer}>
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          {route.title} [{index}]
        </Text>
      </View>
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
  titleContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 50
  },
  navBarText: {
    color: '#424242',
    fontFamily: 'Open Sans',
    marginVertical: 9,
  },
  navBarTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftContainer: {
    marginLeft: 10
  },
  rightContainer: {
    marginRight: 10
  },
  icon: {
    width: 24,
    height: 24,
  }
});

module.exports = function (_parent) {
  NavigationBarRouteMapper.parent = _parent;
  return NavigationBarRouteMapper;
};

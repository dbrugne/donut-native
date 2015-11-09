'use strict';

var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} = React;
var {
  Icon
} = require('react-native-icons');

var LeftButtonView = require('./LeftButtonView');

// @source: https://github.com/facebook/react-native/blob/2b916f3ceffbcb11ed383f958823d221b3feacc6/Examples/UIExplorer/Navigator/NavigationBarSample.js
var routeMapper = {
  LeftButton: function (route, navigator, index, navState) {
    return (
      <LeftButtonView />
    );
  },
  RightButton: function (route, navigator, index, navState) {
    return (
      <TouchableOpacity style={[styles.rightContainer]}>
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
        <Text style={styles.titleText}>
          {route.title} [{index}]
        </Text>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  bar: {
    backgroundColor: '#f4f5f6',
    height: Navigator.NavigationBar.Styles.General.TotalNavHeight,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9'
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 50
  },
  titleText: {
    marginVertical: 9,
    color: '#424242',
    fontFamily: 'Open Sans',
    fontSize: 15,
    fontWeight: 'bold'
  },
  rightContainer: {
    marginRight: 10,
    marginVertical: 9
  },
  icon: {
    width: 24,
    height: 24
  }
});

module.exports = (
  <Navigator.NavigationBar
    routeMapper={routeMapper}
    style={styles.bar}
    />
);

'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  TouchableHighlight,
  ScrollView
} = React;
var {
  Icon
} = require('react-native-icons');

var app = require('../libs/app');
var NavigationRoomsView = require('./NavigationRoomsView');
var NavigationOnesView = require('./NavigationOnesView');

class NavigationView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <TouchableHighlight onPress={() => this.navigateToHome()}>
          <View style={styles.homeContainer}>
            <Icon
              name='fontawesome|home'
              size={20}
              color='#FFFFFF'
              style={styles.icon}
              />
            <Text style={styles.title}>Go to home</Text>
          </View>
        </TouchableHighlight>
        <NavigationOnesView />
        <NavigationRoomsView />
      </ScrollView>
    );
  }

  navigateToHome () {
    app.trigger('navigateTo', {
      name: 'home',
    });
  }

};

var styles = StyleSheet.create({
  main: {
    paddingTop: 25,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    backgroundColor: '#585858'
  },
  homeContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
    marginVertical: 9,
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5
  },
  icon: {
    width: 18,
    height: 18
  }
});

module.exports = NavigationView;

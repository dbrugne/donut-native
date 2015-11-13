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
var CurrentUserView = require('../views/CurrentUserView');
var NavigationOnesView = require('./NavigationOnesView');
var NavigationRoomsView = require('./NavigationRoomsView');

class NavigationView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <CurrentUserView />
        <TouchableHighlight style={styles.homeBlock} onPress={() => app.trigger('navigateTo', 'home')}>
          <View style={styles.homeContainer}>
            <Icon
              name='fontawesome|home'
              size={20}
              color='#FFFFFF'
              style={styles.icon}
              />
            <Text style={styles.title}>Découvrir</Text>
          </View>
        </TouchableHighlight>
        <NavigationOnesView />
        <NavigationRoomsView />
      </ScrollView>
    );
  }
};

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    backgroundColor: '#585858'
  },
  homeBlock: {
    marginVertical: 9
  },
  homeContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
    marginVertical: 9
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

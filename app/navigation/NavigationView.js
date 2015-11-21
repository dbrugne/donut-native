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
var CurrentUserView = require('../components/CurrentUser');
var NavigationOnesView = require('./../components/NavigationOnes');
var NavigationRoomsView = require('./../components/NavigationRooms');
var navigation = require('../libs/navigation');

class NavigationView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <CurrentUserView />
        <View style={{marginVertical: 9}}>
          <TouchableHighlight style={styles.linkBlock} onPress={() => navigation.switchTo(navigation.getHome())}>
            <View style={styles.linkContainer}>
              <Icon
                name='fontawesome|home'
                size={20}
                color='#FFFFFF'
                style={styles.icon}
                />
              <Text style={styles.title}>Découvrir</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.linkBlock} onPress={() => navigation.switchTo(navigation.getSearch())}>
            <View style={styles.linkContainer}>
              <Icon
                name='fontawesome|search'
                size={20}
                color='#FFFFFF'
                style={styles.icon}
                />
              <Text style={styles.title}>Chercher</Text>
            </View>
          </TouchableHighlight>
        </View>
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
  linkBlock: {
  },
  linkContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
    marginVertical: 4
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

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

var _ = require('underscore');
var app = require('../libs/app');
var CurrentUserView = require('../components/CurrentUser');
var NavigationOnesView = require('./../components/NavigationOnes');
var NavigationRoomsView = require('./../components/NavigationRooms');
var navigation = require('../libs/navigation');
var s = require('../styles/style');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'discover': 'discover',
  'search': 'search',
  'create': 'create'
});

class NavigationView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <CurrentUserView />
        <View style={[styles.title, { height:10 }]}></View>
        <View>
          <TouchableHighlight style={styles.linkBlock}
                              underlayColor= '#414041'
                              onPress={() => navigation.switchTo(navigation.getHome())}>
            <View style={styles.linkContainer}>
              <View style={styles.iconCtn}>
                <Icon
                  name='fontawesome|home'
                  size={18}
                  color='#ecf0f1'
                  style={styles.icon}
                  />
              </View>
              <Text style={styles.linkText}>{i18next.t('local:discover')}</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.linkBlock}
                              underlayColor= '#414041'
                              onPress={() => navigation.switchTo(navigation.getSearch())}>
            <View style={styles.linkContainer}>
              <View style={styles.iconCtn}>
                <Icon
                  name='fontawesome|search'
                  size={18}
                  color='#ecf0f1'
                  style={styles.icon}
                  />
              </View>
              <Text style={styles.linkText}>{i18next.t('local:search')}</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.linkBlock}
                              underlayColor= '#414041'
                              onPress={() => navigation.switchTo(navigation.getRoomCreate())}>
            <View style={styles.linkContainer}>
              <View style={styles.iconCtn}>
                <Icon
                  name='fontawesome|plus'
                  size={18}
                  color='#ecf0f1'
                  style={styles.icon}
                  />
              </View>
              <Text style={styles.linkText}>{i18next.t('local:create')}</Text>
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
    backgroundColor: '#272627'
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  linkBlock: {
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  },
  linkText: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    color: '#ecf0f1',
    marginVertical: 8
  },
  iconCtn: {
    marginVertical: 8,
    marginHorizontal: 10
  },
  icon: {
    width: 18,
    height: 18
  },
  title: { backgroundColor: '#1D1D1D'}
});

module.exports = NavigationView;

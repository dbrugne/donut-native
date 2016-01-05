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
  'create': 'create',
  'notifications': 'Notifications'
});

class NavigationView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <CurrentUserView />
        <View style={styles.actions}>
          {this.renderAction('home', () => navigation.switchTo(navigation.getHome()))}
          {this.renderAction('search', () => navigation.switchTo(navigation.getSearch()))}
          {this.renderAction('plus', () => navigation.switchTo(navigation.getRoomCreate()))}
          {this.renderAction('globe', () => navigation.switchTo(navigation.getNotifications()))}
        </View>
        <NavigationOnesView />
        <NavigationRoomsView />
      </ScrollView>
    );
  }

  renderAction (icon, onPress) {
    var iconName = 'fontawesome|' + icon;
    return (
      <TouchableHighlight style={styles.actionBlock}
                          underlayColor= '#414041'
                          onPress={onPress}>
        <Icon
          name={iconName}
          size={26}
          color='#ecf0f1'
          style={styles.actionIcon}
        />
      </TouchableHighlight>
    );
  }
};

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    backgroundColor: '#272627'
  },
  title: { backgroundColor: '#1D1D1D'},
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionBlock: {
    flex: 1,
    padding: 12,
    alignItems: 'center'
  },
  actionIcon: {
    width: 26,
    height: 26
  }
});

module.exports = NavigationView;

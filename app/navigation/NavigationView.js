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
var currentUser = require('../models/current-user');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'discover': 'discover',
  'search': 'search',
  'create': 'create',
  'notifications': 'Notifications'
});

class NavigationView extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      unread: 0
    });
  }

  componentDidMount() {
    currentUser.on('change:unreadNotifications', this.updateUnreadCount.bind(this));
  }

  componentWillUnmount() {
    currentUser.off('change');
  }

  render() {
    return (
      <ScrollView style={styles.main}>
        <CurrentUserView />
        <View style={styles.actions}>
          {this.renderAction('home', false, () => navigation.switchTo(navigation.getHome()))}
          {this.renderAction('search', false, () => navigation.switchTo(navigation.getSearch()))}
          {this.renderAction('plus', false, () => navigation.switchTo(navigation.getRoomCreate()))}
          {this.renderAction('globe', true, () => navigation.switchTo(navigation.getNotifications()))}
        </View>
        <NavigationOnesView />
        <NavigationRoomsView />
      </ScrollView>
    );
  }

  renderAction(icon, count, onPress) {
    var iconName = 'fontawesome|' + icon;
    let _count = null;
    if (count && this.state.unread > 0) {
      _count = (
        <View
          style={{backgroundColor:'#fd5286', height:18, borderRadius:9, position: 'absolute', top:-5, right:-5, paddingLeft:5, paddingRight:5}}>
          <Text style={{marginTop:1, fontSize:12, color:'#FFFFFF', fontWeight:'bold'}}>{this.state.unread}</Text>
        </View>
      );
    }
    return (
      <TouchableHighlight style={styles.actionBlock}
                          underlayColor='#414041'
                          onPress={onPress}>
        <View>
          <Icon
            name={iconName}
            size={26}
            color='#ecf0f1'
            style={styles.actionIcon}
            />
          {_count}
        </View>
      </TouchableHighlight>
    );
  }

  updateUnreadCount() {
    this.setState(
      {unread: currentUser.getUnreadNotifications()}
    );
  }
}
;

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    backgroundColor: '#272627'
  },
  title: {backgroundColor: '#1D1D1D'},
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

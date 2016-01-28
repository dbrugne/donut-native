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
var Icon = require('react-native-vector-icons/FontAwesome');

var CurrentUserView = require('./DrawerContentUser');
var NavigationOnesView = require('./DrawerContentOnes');
var NavigationRoomsView = require('./DrawerContentRooms');
var NavigationGroupsView = require('./DrawerContentGroups');
var navigation = require('../../navigation/index');
var app = require('../../libs/app');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'drawerContent', {
  'discover': 'discover',
  'search': 'search',
  'create': 'create',
  'notifications': 'Notifications'
});

class DrawerContent extends Component {
  constructor (props) {
    super(props);
    this.state = ({
      unread: 0
    });
  }
  componentDidMount () {
    app.user.on('change:unviewedNotification', this.updateBadge, this);
  }
  componentWillUnmount () {
    app.user.off(null, null, this);
  }
  render () {
    return (
      <ScrollView style={styles.main}>
        <CurrentUserView />
        <View style={styles.actions}>
          {this.renderAction('home', false, () => navigation.navigate('Discover'))}
          {this.renderAction('search', false, () => navigation.navigate('Search'))}
          {this.renderAction('plus', false, () => navigation.navigate('CreateRoom'))}
          {this.renderAction('bell', true, () => navigation.navigate('Notifications'))}
        </View>
        <NavigationOnesView />
        <NavigationRoomsView />
        <NavigationGroupsView />
      </ScrollView>
    );
  }
  renderAction (icon, count, onPress) {
    var iconName = 'fontawesome|' + icon;
    let _count = null;
    if (count && this.state.unread > 0) {
      _count = (
        <View
          style={{backgroundColor: '#fd5286', height: 18, borderRadius: 9, position: 'absolute', top: -5, right: -5, paddingLeft: 5, paddingRight: 5}}>
          <Text style={{marginTop: 1, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold'}}>{this.state.unread}</Text>
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
  updateBadge () {
    this.setState(
      {unread: app.user.get('unviewedNotification')}
    );
  }
}

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

module.exports = DrawerContent;

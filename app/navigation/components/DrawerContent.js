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
var NotConfirmedComponent = require('../../components/NotConfirmed');

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
        <NotConfirmedComponent />
        <CurrentUserView />
        <View style={styles.actions}>
          <TouchableHighlight style={[styles.actionBlock, {
          borderColor: '#353F4C',
          borderStyle: 'solid',
          borderRightWidth: 1
          }]}
                              underlayColor='#414041'
                              onPress={() => navigation.navigate('Discover')}>
            <View>
              <Icon
                name={'home'}
                size={26}
                color='rgba(208,217,230,40)'
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.actionBlock, {
          borderColor: '#353F4C',
          borderStyle: 'solid',
          borderRightWidth: 1
          }]}
                              underlayColor='#414041'
                              onPress={() => navigation.navigate('Search')}>
            <View>
              <Icon
                name={'search'}
                size={26}
                color='rgba(208,217,230,40)'
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.actionBlock, {
          borderColor: '#353F4C',
          borderStyle: 'solid',
          borderRightWidth: 1
          }]}
                              underlayColor='#414041'
                              onPress={() => navigation.navigate('Create')}>
            <View>
              <Icon
                name={'plus'}
                size={26}
                color='rgba(208,217,230,40)'
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.actionBlock}
                              underlayColor='#414041'
                              onPress={() => navigation.navigate('Notifications')}>
            <View>
              <Icon
                name={'bell'}
                size={26}
                color='rgba(208,217,230,40)'
                />
              {this._renderCount()}
            </View>
          </TouchableHighlight>

        </View>

        <NavigationRoomsView />
        <NavigationOnesView />
        <NavigationGroupsView />
      </ScrollView>
    );
  }

  _renderCount () {
    if (this.state.unread === 0) {
      return null;
    }

    return (
      <View style={{backgroundColor: '#fd5286', height: 18, borderRadius: 9, position: 'absolute', top: -5, right: -5, paddingLeft: 5, paddingRight: 5}}>
        <Text style={{marginTop: 1, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold'}}>{this.state.unread}</Text>
      </View>
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
    backgroundColor: '#353F4C',
    borderColor: '#FC2063',
    borderStyle: 'solid',
    borderLeftWidth: 2
  },
  title: {
    backgroundColor: '#1D1D1D'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(29,37,47,30)',
    borderColor: '#353F4C',
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  actionBlock: {
    flex: 1,
    padding: 12,
    alignItems: 'center'
  }
});

module.exports = DrawerContent;

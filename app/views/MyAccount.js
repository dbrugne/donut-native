'use strict';

var React = require('react-native');
var currentUser = require('../models/current-user');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var ConnectionState = require('../components/ConnectionState');

var {
  Component,
  Text,
  ScrollView,
  View,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'manage': 'MANAGE YOUR PROFILE INFORMATIONS',
  'edit': 'Edit Profile',
  'change-preferences': 'Change preferences',
  'login': 'LOGIN AND EMAILS',
  'manage-emails': 'Manage emails',
  'change-password': 'Change password',
  'about': 'About',
  'eutc': 'Privacy and conditions',
  'logout': 'Logout'
});

class MyAccountView extends Component {
  constructor (props) {
    super(props);
    this.data = props.data;
  }
  render () {
    return (
      <View style={{flex: 1}}>
        <ConnectionState/>
        <ScrollView style={styles.main}>
          <View style={s.listGroup}>
            <ListItem
              onPress={() => navigation.navigate('MyAccountInformation')}
              text={i18next.t('local:edit')}
              first
              action
              type='button'
              title={i18next.t('local:manage')}
            />
            <ListItem
              onPress={() => navigation.navigate('MyAccountPreferences')}
              text={i18next.t('local:change-preferences')}
              action
              type='button'
            />
            <Text style={s.listGroupItemSpacing} />
            <ListItem
              onPress={() => navigation.navigate('MyAccountEmails')}
              text={i18next.t('local:manage-emails')}
              action
              type='button'
              first
              title={i18next.t('local:login')}
            />
            <ListItem
              onPress={() => navigation.navigate('MyAccountPassword')}
              text={i18next.t('local:change-password')}
              action
              type='button'
            />
            <Text style={s.listGroupItemSpacing} />
            <ListItem
              onPress={() => navigation.navigate('About')}
              text={i18next.t('local:about')}
              action
              first
              type='button'
            />
            <ListItem text={i18next.t('local:eutc')}
                      type='button'
                      onPress={() => navigation.navigate('Eutc')}
            />
            <ListItem
              onPress={() => currentUser.logout()}
              text={i18next.t('local:logout')}
              type='button'
              warning
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 20
  }
});

module.exports = MyAccountView;

'use strict';

var React = require('react-native');
var currentUser = require('../models/current-user');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');

var {
  Component,
  Text,
  ScrollView,
  View,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccount', {
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
      <ScrollView style={styles.main}>
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('MyAccountInformation')}
            text={i18next.t('myAccount:edit')}
            first
            action
            type='button'
            title={i18next.t('myAccount:manage')}
          />
          <ListItem
            onPress={() => navigation.navigate('MyAccountPreferences')}
            text={i18next.t('myAccount:change-preferences')}
            action
            type='button'
          />
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={() => navigation.navigate('MyAccountEmails')}
            text={i18next.t('myAccount:manage-emails')}
            action
            type='button'
            first
            title={i18next.t('myAccount:login')}
          />
          <ListItem
            onPress={() => navigation.navigate('MyAccountPassword')}
            text={i18next.t('myAccount:change-password')}
            action
            type='button'
          />
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={() => navigation.navigate('About')}
            text={i18next.t('myAccount:about')}
            action
            first
            type='button'
          />
          <ListItem text={i18next.t('myAccount:eutc')}
                    type='button'
                    onPress={() => navigation.navigate('Eutc')}
          />
          <ListItem
            onPress={() => currentUser.logout()}
            text={i18next.t('myAccount:logout')}
            type='button'
            warning
          />
        </View>
      </ScrollView>
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

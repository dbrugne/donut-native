'use strict';

var _ = require('underscore');
var React = require('react-native');
var currentUser = require('../models/mobile-current-user');
var s = require('../styles/style');
var app = require('../libs/app');
var navigation = require('../libs/navigation');
var ListGroupItem = require('../components/ListGroupItem');

var {
  Component,
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableHighlight
  } = React;
var {
  Icon
} = require('react-native-icons');

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'manage': 'MANAGE YOUR PROFILE INFORMATIONS',
  'edit': 'Edit Profile',
  'change-preferences': 'Change preferences',
  'login': 'LOGIN AND EMAILS',
  'manage-emails': 'Manage emails',
  'change-password': 'Change password',
  'logout': 'Logout'
};
i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

class MyAccountView extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
  }

  render() {
    return (
      <ScrollView style={styles.main}>
        <View style={s.listGroup}>

          <Text style={s.listGroupTitle}>{i18next.t('manage')}</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountInformation())}
                         text={i18next.t('edit')}
                         first={true}
                         action='true'
                         type='button'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPreferences())}
                         text={i18next.t('change-preferences')}
                         action='true'
                         type='button'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <Text style={s.listGroupTitle}>{i18next.t('login')}</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmails())}
                         text={i18next.t('manage-emails')}
                         action='true'
                         type='button'
                         first='true'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPassword())}
                         text={i18next.t('change-password')}
                         action='true'
                         type='button'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <ListGroupItem onPress={() => currentUser.logout()}
                         text={i18next.t('logout')}
                         type='button'
                         warning='true'
            />

        </View>
      </ScrollView>
    )
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

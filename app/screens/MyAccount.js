'use strict';

var React = require('react-native');
var currentUser = require('../models/current-user');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var ListItem = require('../elements/ListItem');

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
  'logout': 'Logout'
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
          <ListItem onPress={() => this.props.navigator.push(navigation.getMyAccountInformation())}
                    text={i18next.t('local:edit')}
                    first
                    action='true'
                    type='button'
                    title={i18next.t('local:manage')}
            />
          <ListItem onPress={() => this.props.navigator.push(navigation.getMyAccountPreferences())}
                    text={i18next.t('local:change-preferences')}
                    action='true'
                    type='button'
            />
          <Text style={s.listGroupItemSpacing}></Text>
          <ListItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmails())}
                    text={i18next.t('local:manage-emails')}
                    action='true'
                    type='button'
                    first
                    title={i18next.t('local:login')}
            />
          <ListItem onPress={() => this.props.navigator.push(navigation.getMyAccountPassword())}
                    text={i18next.t('local:change-password')}
                    action='true'
                    type='button'
            />
          <Text style={s.listGroupItemSpacing}></Text>
          <ListItem onPress={() => navigation.navigate('About')}
                    text={i18next.t('local:about')}
                    action='true'
                    first
                    type='button'
            />
          <ListItem onPress={() => currentUser.logout()}
                    text={i18next.t('local:logout')}
                    type='button'
                    warning='true'
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

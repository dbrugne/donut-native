'use strict';

var _ = require('underscore');
var React = require('react-native');
var currentUser = require('../models/mobile-current-user');
var s = require('../styles/style');
var app = require('../libs/app');
var navigation = require('../libs/navigation');
var ListGroupItem = require('../components/ListGroupItem');
var config = require('../libs/config')();

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

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'manage': 'MANAGE YOUR PROFILE INFORMATIONS',
  'edit': 'Edit Profile',
  'change-preferences': 'Change preferences',
  'login': 'LOGIN AND EMAILS',
  'manage-emails': 'Manage emails',
  'change-password': 'Change password',
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

          <Text style={s.listGroupTitle}>{i18next.t('local:manage')}</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountInformation())}
                         text={i18next.t('local:edit')}
                         first={true}
                         action='true'
                         type='button'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPreferences())}
                         text={i18next.t('local:change-preferences')}
                         action='true'
                         type='button'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <Text style={s.listGroupTitle}>{i18next.t('local:login')}</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmails())}
                         text={i18next.t('local:manage-emails')}
                         action='true'
                         type='button'
                         first='true'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPassword())}
                         text={i18next.t('local:change-password')}
                         action='true'
                         type='button'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <ListGroupItem onPress={() => currentUser.logout()}
                         text={i18next.t('local:logout')}
                         type='button'
                         warning='true'
            />
          <Text>{JSON.stringify(config)}</Text>

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

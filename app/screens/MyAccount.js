'use strict';
var React = require('react-native');
var _ = require('underscore');
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

class MyAccountView extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
  }

  render() {
    return (
      <ScrollView style={styles.main}>

        <View style={s.listGroup}>


          <Text style={s.listGroupTitle}>MANAGE YOUR PROFILE INFORMATIONS</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountProfile())}
                         text='Edit profile'
                         action='true'
                         first='true'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountInformation())}
                         text='Edit information'
                         action='true'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPassword())}
                         text='Change password'
                         action='true'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <Text style={s.listGroupTitle}>MANAGE YOUR PREFERENCES</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPreferences())}
                         text='Change preferences'
                         action='true'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <Text style={s.listGroupTitle}>MANAGE YOUR EMAILS</Text>

          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmail())}
                         text='Change Email'
                         action='true'
                         first='true'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmails())}
                         text='Manage emails'
                         action='true'
                         first='true'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <ListGroupItem onPress={() => currentUser.logout()}
                         text='Logout'
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

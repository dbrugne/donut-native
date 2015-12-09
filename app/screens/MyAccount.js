'use strict';
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
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountInformation())}
                         text='Edit Profile'
                         first={true}
                         action='true'
                         type='button'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPreferences())}
                         text='Change preferences'
                         action='true'
                         type='button'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <Text style={s.listGroupTitle}>LOGIN AND EMAILS</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmails())}
                         text='Manage emails'
                         action='true'
                         type='button'
                         first='true'
            />
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountPassword())}
                         text='Change password'
                         action='true'
                         type='button'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <ListGroupItem onPress={() => currentUser.logout()}
                         text='Logout'
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

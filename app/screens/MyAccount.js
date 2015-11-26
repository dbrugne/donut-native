'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/mobile-current-user');
var s = require('../styles/style');

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

var app = require('../libs/app');
var navigation = require('../libs/navigation');

class MyAccountView extends Component {
  constructor (props) {
    super(props);

    this.data = props.data;
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <View style={s.listGroup}>

          <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getMyAccountProfile())}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Edit profile</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getMyAccountInformation())}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Edit information</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getMyAccountPreferences())}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Change preferences</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getMyAccountEmail())}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Change Email</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getMyAccountPassword())}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Change password</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getMyAccountEmails())}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Manage emails</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => currentUser.logout()}
                              underlayColor= '#DDD'
            >
            <View style={s.listGroupItem}>
              <Text style={s.listGroupItemText}>Logout</Text>
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
            </View>
          </TouchableHighlight>

        </View>
      </ScrollView>
    )
  }
}


var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  }
});

module.exports = MyAccountView;

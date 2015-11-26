'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/mobile-current-user');
var s = require('../styles/style');

var {
  Component,
  Text,
  ListView,
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

class ForgotView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <View style={s.listGroup}>
          <ListView dataSource={this.state.dataSource.cloneWithRows(items)}
            renderRow={this.renderElement.bind(this)}
          />
        </View>
      </ScrollView>
    )
  }

  renderElement(item) {
    return (
    <TouchableHighlight onPress={this[item.fc].bind(this)}
                        underlayColor= '#DDD'
      >
      <View style={s.listGroupItem}>
        <Text style={s.listGroupItemText}>{item.title}</Text>
        <Icon
          name='fontawesome|chevron-right'
          size={14}
          color='#DDD'
          style={s.listGroupItemIconRight}
          />
      </View>
    </TouchableHighlight>
    );
  }

  _onChangeEmail () {
    this.props.navigator.push(navigation.getMyAccountEmail());
  }
  _onChangePassword () {
    this.props.navigator.push(navigation.getMyAccountPassword());
  }
  _onManageEmails () {
    this.props.navigator.push(navigation.getMyAccountEmails());
  }
  _onEditProfile () {
    this.props.navigator.push(navigation.getMyAccountProfile());
  }
  _onEditInformation () {
    this.props.navigator.push(navigation.getMyAccountInformation());
  }
  _onChangePreferences () {
    this.props.navigator.push(navigation.getMyAccountPreferences());
  }
  _onLogout () {
    currentUser.logout();
  }
}

var items = [
  {title: 'Edit profile', fc: '_onEditProfile'},
  {title: 'Edit information', fc: '_onEditInformation'},
  {title: 'Change preferences', fc: '_onChangePreferences'},
  {title: 'Change Email', fc: '_onChangeEmail'},
  {title: 'Change password', fc: '_onChangePassword'},
  {title: 'Manage emails', fc: '_onManageEmails'},
  {title: 'Logout', fc: '_onLogout'}
];

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  }
});

module.exports = ForgotView;

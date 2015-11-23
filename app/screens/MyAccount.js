'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/mobile-current-user');
var Button = require('react-native-button');

var {
  Component,
  Text,
  ListView,
  View,
  StyleSheet,
  TouchableHighlight
} = React;

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
      <ListView style={styles.container}
        dataSource={this.state.dataSource.cloneWithRows(items)}
        renderRow={this.renderElement.bind(this)}
      />
    )
  }

  renderElement(item) {
    return (
      <Button onPress={this[item.fc].bind(this)} style={styles.row}>
        {item.title}
      </Button>
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
  container: {
    flex: 1
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
    color: '#777',
    lineHeight: 40
  }
});

module.exports = ForgotView;

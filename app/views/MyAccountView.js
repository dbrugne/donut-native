'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');

var {
  Component,
  Text,
  ListView,
  View,
  StyleSheet,
  TouchableHighlight
  } = React;

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
      <TouchableHighlight onPress={this[item.fc].bind(this)} style={styles.row}>
        <View>
            <Text style={styles.item}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _onChangeEmail () {

  }
  _onChangePassword () {

  }
  _onAddEmail () {

  }
  _onEditProfile () {

  }
  _onChangePreferences () {

  }
  _onLogout () {
    currentUser.logout();
  }
}

var items = [
  {title: 'Change Email', fc: '_onChangeEmail'},
  {title: 'Change password', fc: '_onChangePassword'},
  {title: 'Add email', fc: '_onAddEmail'},
  {title: 'Edit profile', fc: '_onEditProfile'},
  {title: 'Change preferences', fc: '_onChangePreferences'},
  {title: 'Logout', fc: '_onLogout'}
];

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#111',
    marginBottom: 1
  },
  item: {
    fontSize: 20,
    color: "#EEE"
  }
});

module.exports = ForgotView;

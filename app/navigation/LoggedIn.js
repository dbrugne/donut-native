'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  Component,
} = React;

var client = require('../libs/client');
var currentUser = require('../models/current-user');

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
    this.client = client;
  }

  componentDidMount () {
//    this.client.connect(); // @todo
  }

  // @todo : unmount listeners

  render () {

    // @todo : mount navigation + drawer

    return (
      <View style={styles.main}>
        <Text>Authentication OK!</Text>
        <Text>{currentUser.oauth.token}</Text>
        <Text>{currentUser.oauth.code}</Text>
        <TouchableHighlight onPress={() => currentUser.logout()} style={styles.button}>
          <Text style={styles.logout}>LOGOUT</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    marginTop: 60
  }
});

module.exports = Index;
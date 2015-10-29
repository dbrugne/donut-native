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
var NavigationBar = require('./NavigationBar');

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
    this.client = client;
  }

  componentDidMount () {
    this.client.connect();
  }

  componentWillUnmount () {
    this.client.disconnect();
  }

  render () {

    // @todo : mount navigation + drawer

    return (
      <View style={styles.main}>
        <NavigationBar />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1
  }
});

module.exports = Index;
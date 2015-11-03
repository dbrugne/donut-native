'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  TouchableHighlight,
  ScrollView
} = React;

var app = require('../libs/app');
var NavigationRoomsView = require('./NavigationRoomsView');
var NavigationOnesView = require('./NavigationOnesView');

class NavigationView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ScrollView style={styles.main}>
        <TouchableHighlight onPress={() => this.navigateToHome()}>
          <Text style={styles.title}>HOME</Text>
        </TouchableHighlight>
        <NavigationOnesView />
        <NavigationRoomsView />
      </ScrollView>
    );
  }

  navigateToHome () {
    app.trigger('navigateTo', {
      name: 'home',
    });
  }

};

var styles = StyleSheet.create({
  main: {
    marginTop: 25,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    color: '#00FF00'
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  }
});

module.exports = NavigationView;

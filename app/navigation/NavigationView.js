'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  TouchableHighlight
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
      <View style={styles.main}>
        <TouchableHighlight onPress={() => this.navigateToHome()}>
          <Text style={styles.title}>HOME</Text>
        </TouchableHighlight>
        <NavigationOnesView />
        <NavigationRoomsView />
      </View>
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
    flexWrap: 'nowrap'
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  }
});

module.exports = NavigationView;

'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
  ScrollView
} = React;

var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/current-user');

var HomeFeaturedView = require('./HomeFeaturedView');

class HomeView extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.main}>
        <HomeFeaturedView />
        <View style={styles.links}>
          <Text>Authentication OK!</Text>
          <Text>{currentUser.oauth.token}</Text>
          <Text>{currentUser.oauth.code}</Text>
          <TouchableHighlight onPress={() => currentUser.logout()} style={styles.button}>
            <Text style={styles.logout}>LOGOUT</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.test1.bind(this)} style={styles.button}>
            <Text style={styles.test}>__TEST1__</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.test2.bind(this)} style={styles.button}>
            <Text style={styles.test}>__TEST2__</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  test1 () {
    app.trigger('navigateTo', {name: 'test1', title: 'test1', component: require('./Test1')});
  }

  test2 () {
    app.trigger('navigateTo', {name: 'test2', title: 'test2', component: require('./Test2')});
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
//    marginTop: NavigatorNavigationBarStyles.General.TotalNavHeight,
    backgroundColor: '#666666',
  },
  links: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
});

module.exports = HomeView;

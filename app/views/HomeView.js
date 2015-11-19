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
          <TouchableHighlight onPress={this._onLogout.bind(this)} style={styles.button}>
            <Text style={styles.test}>Logout</Text>
          </TouchableHighlight>
          <Text style={styles.text}>Authentication OK!</Text>
          <Text style={styles.text}>{currentUser.oauth.token}</Text>
          <Text style={styles.text}>{currentUser.oauth.code}</Text>
          <TouchableHighlight onPress={this.test1.bind(this)} style={styles.button}>
            <Text style={styles.test}>__TEST1__</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.test2.bind(this)} style={styles.button}>
            <Text style={styles.test}>__TEST2__</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.search.bind(this)} style={styles.button}>
            <Text style={styles.test}>__SEARCH__</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  /****************************
   * DEBUG
   ****************************/
  componentDidMount() {
    //require('../libs/client').on('welcome', (data) => app.trigger('navigateTo', 'room/557ed3a4bcb50bc52b74744b'));
  }
  test1 () {
    app.trigger('navigateTo', 'test1');
  }
  test2 () {
    app.trigger('navigateTo', 'test2');
  }
  search () {
    app.trigger('navigateTo', 'search');
  }
  _onLogout () {
    currentUser.logout();
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
    backgroundColor: '#EEEEEE'
  },
  text: {
    fontSize: 10

  },
  test: {
    fontSize: 10
  }
});

module.exports = HomeView;

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
} = React;

var app = require('../libs/app');

class TestView extends Component {
  constructor (props) {
    console.log('construct test1');
    super(props);
  }
  render() {
    console.log('render test1');
    return (
      <View style={styles.main}>
        <Text style={styles.test}>Test1</Text>
        <TouchableHighlight onPress={this.home.bind(this)} style={styles.button}>
          <Text style={styles.test}>__HOME__</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.test2.bind(this)} style={styles.button}>
          <Text style={styles.test}>__TEST2__</Text>
        </TouchableHighlight>
      </View>
    );
  }

  home () {
    app.trigger('navigateTo', {name: 'home', title: 'home', component: require('./HomeView')});
  }

  test2 () {
    app.trigger('navigateTo', {name: 'test2', title: 'test2', component: require('./Test2')});
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#666666',
  },
});

module.exports = TestView;

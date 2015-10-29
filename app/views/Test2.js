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
    console.log('construct test2');
    super(props);
  }
  render() {
    console.log('render test2');
    return (
      <View style={styles.main}>
        <Text style={styles.test}>Test1</Text>
        <TouchableHighlight onPress={this.test1.bind(this)} style={styles.button}>
          <Text style={styles.test}>__TEST1__</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.home.bind(this)} style={styles.button}>
          <Text style={styles.test}>__HOME__</Text>
        </TouchableHighlight>
      </View>
    );
  }

  test1 () {
    app.trigger('navigateTo', {name: 'test1', title: 'test1', component: require('./Test1')});
  }

  home () {
    app.trigger('navigateTo', {name: 'home', title: 'home', component: require('./HomeView')});
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#666666',
  },
});

module.exports = TestView;

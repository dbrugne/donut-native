'use strict';

var _ = require('underscore');
var React = require('react-native');
var s = require('../styles/style');
var client = require('../libs/client');
var app = require('../libs/app');
var Alert = require('../libs/alert');

var {
  Component,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

class UserField extends Component {
  constructor (props) {
    super(props);

    this.state = {value: props.data.value};
  }

  render () {
    var field = this.renderField();
    return (
      <View style={styles.container}>
        <Text style={[s.h1, {marginVertical:10, marginHorizontal: 10}]}>Change your {this.key}</Text>

        <View style={s.inputContainer}>
          {field}
        </View>

        <View style={s.filler}></View>

      </View>
    );
  }
  renderField () {
    return (<View />);
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    flex:1
  }
});

module.exports = UserField;
'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    return (
      <View style={[s.dateBlock, s.event]}>
        <Text style={s.dateContent}>{this.props.data.text}</Text>
      </View>
    );
  }
});

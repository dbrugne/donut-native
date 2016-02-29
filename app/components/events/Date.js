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
        <View style={{flex:1, justifyContent: 'center', flexDirection: 'column'}}>
          <View style={{height:1, backgroundColor: '#D0D9E6'}}></View>
        </View>
        <Text style={s.dateContent}>{this.props.data.text}</Text>
        <View style={{flex:1, justifyContent: 'center', flexDirection: 'column'}}>
          <View style={{height:1, backgroundColor: '#D0D9E6'}}></View>
        </View>
      </View>
    );
  }
});

'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  View,
  TouchableHighlight,
  Text
  } = React;

class ListItemColor extends ListItemAbstract {
  _renderContent () {
    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor='#DDD'
                          style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}
        >
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
          {this._renderElement()}
        </View>
      </TouchableHighlight>
    );
  }

  _renderElement () {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <View style={{alignSelf: 'center', flex:1, flexDirection: 'row', alignItems:'center'}}>
          <Text style={s.listGroupItemText}>{this.props.text}</Text>
        </View>
        <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
          <View style={[s.color, {backgroundColor: this.props.color}]}/>
          {this._renderRightIcon()}
        </View>
      </View>
    );
  }
}
module.exports = ListItemColor;

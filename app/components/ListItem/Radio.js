'use strict';

var React = require('react-native');
var Platform = require('Platform');
var ListItemAbstract = require('./Abstract');
var s = require('../../styles/elements/listItem');

var {
  View,
  TouchableHighlight,
  Text
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

class ListItemRadio extends ListItemAbstract {
  _renderContent () {
    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor='#DDD'
                          style={[s.listGroupItem, this.props.style, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}
        >
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
          {this._renderLeftIcon()}
          {this._renderElement()}
        </View>
      </TouchableHighlight>
    );
  }

  _renderLeftIcon () {
    return (
      <Icon
        name={this.props.active ? 'circle' : 'circle-o'}
        size={14}
        color={this.props.active ? 'red' : '#666'}
        style={s.listGroupItemIconLeft}
        />
    );
  }

  _renderElement () {
    return (
      <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
    );
  }
}

module.exports = ListItemRadio;
'use strict';

var React = require('react-native');
var LoadingView = require('../Loading');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  View,
  TouchableHighlight,
  Text
  } = React;

class ListItemButton extends ListItemAbstract {

  _renderContent () {
    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor='#DDD'
                          style={[s.listGroupItem, this.props.style, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}
        >
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
          {this._renderLeftIcon()}
          {this._renderLeftImage()}
          {this._renderElement()}
          {this._renderRightImage()}
          {this._renderRightIcon()}
        </View>
      </TouchableHighlight>
    );
  }

  _renderElement () {
    return (
      <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
    );
  }
}

module.exports = ListItemButton;
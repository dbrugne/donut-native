'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  View,
  TouchableHighlight,
  Text
  } = React;

class ListItemEdit extends ListItemAbstract {
  _renderContent () {
    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor='#DDD'
                          style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}
        >
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
          {this._renderLeftIcon()}
          {this._renderElement()}
          {this._renderRightIcon()}
        </View>
      </TouchableHighlight>
    );
  }

  _renderElement () {
    var value;
    if (this.props.value && this.props.value.length < 30) {
      value = this.props.value;
    } else if (this.props.value && typeof this.props.value !== 'object') {
      value = this.props.value.slice(0, 12) + '...';
    }

    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
        <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
          <Text style={{color: '#999', fontFamily: 'Open Sans', fontSize: 16, paddingBottom: 1, marginRight: 10}}>{value}</Text>
        </View>
      </View>
    );
  }
}

module.exports = ListItemEdit;
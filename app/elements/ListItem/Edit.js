'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('./style');

var {
  Component,
  View,
  TouchableHighlight,
  Text
} = React;

class ListItemEdit extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    var value;
    if (this.props.value && this.props.value.length < 30) {
      value = this.props.value;
    } else if (this.props.value && typeof this.props.value !== 'object') {
      value = this.props.value.slice(0, 12) + '...';
    }

    return (
      <TouchableHighlight onPress={() => this.props.onPress()}
                          underlayColor= '#DDD'
        >
        <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
          {this.props.leftIcon}
          <Text style={s.listGroupItemText}>{this.props.text}</Text>
          <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
            <Text style={{color: '#999', fontFamily: 'Open Sans', fontSize: 16, paddingBottom: 1, marginRight: 10}}>{value}</Text>
          </View>
          {this.props.rightIcon}
        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = ListItemEdit;
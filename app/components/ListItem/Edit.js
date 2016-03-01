'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');
var common = require('@dbrugne/donut-common/mobile');

var {
  View,
  TouchableHighlight,
  Text,
  Image
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
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <Text style={[s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{this.props.text}</Text>
        <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
          {this._renderValue()}
        </View>
      </View>
    );
  }

  _renderValue() {
    if (this.props.image) {
      let avatarUrl = common.cloudinary.prepare(this.props.image, 50);
      return (<Image style={{width: 30, height: 30, marginHorizontal: 2}} source={{uri: avatarUrl}}/>);
    }

    var value = !this.props.value
      ? null
      : this.props.value.length < 30
        ? this.props.value
        : this.props.value.slice(0, 27) + '...';

    return (<Text style={{color: '#999', fontFamily: 'Open Sans', fontSize: 16, paddingBottom: 1, marginRight: 10}}>{value}</Text>);
  }
}

module.exports = ListItemEdit;
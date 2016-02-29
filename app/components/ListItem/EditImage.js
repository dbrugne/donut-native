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

class ListItemEditImage extends ListItemAbstract {
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
    let avatarUrl = common.cloudinary.prepare(this.props.avatar, 50);
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <Text style={s.listGroupItemText}>{this.props.text}</Text>
        <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
          <Image style={{width: 30, height: 30, marginHorizontal: 2}} source={{uri: avatarUrl}}/>
        </View>
      </View>
    );
  }
}

module.exports = ListItemEditImage;
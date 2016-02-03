'use strict';

var React = require('react-native');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');
var navigation = require('../../navigation/index');

var {
  View,
  TouchableHighlight,
  Text,
  Image
} = React;

class ListItemImageList extends ListItemAbstract {
  _renderContent () {
    return (
      <View>
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
        {this._renderImageList()}
      </View>
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
        <Text style={s.listGroupItemText}>{this.props.text}</Text>
        <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
          <Text style={{color: '#999', fontFamily: 'Open Sans', fontSize: 16, paddingBottom: 1, marginRight: 10}}>{value}</Text>
        </View>
      </View>
    );
  }

  _renderImageList() {
    if (!this.props.imageList || this.props.imageList.length === 0) {
      return null;
    }

    return (
      <View style={{flexDirection: 'row', flex: 1, height: 50, alignItems: 'center', flexWrap: 'wrap'}} >
        {_.map(this.props.imageList, (item) => {
          return this._renderImageButton(item);
        })}
      </View>
    );
  }

  _renderImageButton(item) {
    if (_.has(item, 'user_id')) {
      let avatarUrl = common.cloudinary.prepare(item.avatar, 60);
      return (
        <TouchableHighlight key={item.user_id}
                            underlayColor='transparent'
                            onPress={() => navigation.navigate('Profile', {type: 'user', id: item.user_id, identifier: '@' + item.username})}>
          <Image style={{width: 40, height: 40, marginHorizontal: 2}} source={{uri: avatarUrl}}/>
        </TouchableHighlight>
      );
    }

    if (_.has(item, 'room_id')) {
      let avatarUrl = common.cloudinary.prepare(item.avatar, 60);
      return (
        <TouchableHighlight key={item.room_id}
                            underlayColor='transparent'
                            onPress={() => navigation.navigate('Profile', {type: 'room', id: item.room_id, identifier: item.identifier})}>
          <Image style={{width: 40, height: 40, marginHorizontal: 2}} source={{uri: avatarUrl}}/>
        </TouchableHighlight>
      );
    }

    return null;
  }
}

module.exports = ListItemImageList;
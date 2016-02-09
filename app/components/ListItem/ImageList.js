'use strict';

var React = require('react-native');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');
var navigation = require('../../navigation/index');
var userActionSheet = require('../../libs/UserActionsSheet');
var app = require('../../libs/app');

var {
  View,
  TouchableHighlight,
  Text,
  Image,
  ScrollView
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
        <Text style={[s.listGroupItemText, {color: '#353F4C', fontFamily: 'Open Sans', fontWeight: '600', fontSize: 16}]}>{this.props.text}</Text>
        <View style={{alignSelf: 'center', flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: '#B3BECC', fontFamily: 'Open Sans', fontWeight: '500', fontSize: 16, paddingBottom: 1, marginRight: 10}}>{value}</Text>
        </View>
      </View>
    );
  }
  _renderImageList () {
    if (!this.props.imageList || this.props.imageList.length === 0) {
      return null;
    }
    
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{height: 200, flex: 1, marginLeft: 10, marginTop: 10}}
        contentContainerStyle={{alignItems: 'flex-start', flex: 1}}>
        {_.map(this.props.imageList, (item) => {
          return this._renderImageButton(item);
        })}
        </ScrollView>
    );
  }

  _renderImageButton (item) {
    if (_.has(item, 'user_id')) {
      let avatarUrl = common.cloudinary.prepare(item.avatar, 160);
      return (
        <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}
              key={'user' + item.user_id}
          >
          <View style={{position: 'relative', marginHorizontal: 2}}>
            <Image style={{width: 160, height: 130, position: 'absolute', top: 0, left: 0}} source={{uri: avatarUrl}}/>
            <TouchableHighlight underlayColor='transparent'
                                onPress={() => this._renderActionSheet(item)}
                                style={{width: 160, height: 130}}
              >
              <Image style={{width: 60, height: 60, position: 'absolute', top: 15, left: 50}} source={{uri: avatarUrl}}/>
            </TouchableHighlight>
          </View>
          <TouchableHighlight underlayColor='transparent'
                              style={{width: 80, alignSelf:'center', marginTop: 5}}
                              onPress={() => app.trigger('joinUser', item.user_id)}
            >
            <Text style={{backgroundColor: '#E7ECF3', textAlign:'center', marginVertical:2, marginHorizontal:2, borderRadius: 4, paddingHorizontal: 3, paddingVertical: 3}}>CHAT</Text>
          </TouchableHighlight>
        </View>
      );
    }

    if (_.has(item, 'room_id')) {
      let avatarUrl = common.cloudinary.prepare(item.avatar, 160);
      return (
        <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}
              key={'room' + item.room_id}
          >
          <View style={{position: 'relative', marginHorizontal: 2}}>
            <Image style={{width: 160, height: 130, position: 'absolute', top: 0, left: 0}} source={{uri: avatarUrl}}/>
            <TouchableHighlight underlayColor='transparent'
                                onPress={() => navigation.navigate('Profile', {type: 'room', id: item.room_id, identifier: item.identifier})}
                                style={{width: 160, height: 130}}
              >
              <Image style={{width: 60, height: 60, position: 'absolute', top: 15, left: 50}} source={{uri: avatarUrl}}/>
            </TouchableHighlight>
          </View>
          <TouchableHighlight underlayColor='transparent'
                              style={{width: 80, alignSelf:'center', marginTop: 5}}
                              onPress={() => app.trigger('joinRoom', item.room_id)}
            >
            <Text style={{backgroundColor: '#E7ECF3', textAlign:'center', marginVertical:2, marginHorizontal:2, borderRadius: 4, paddingHorizontal: 3, paddingVertical: 3}}>JOIN</Text>
          </TouchableHighlight>
        </View>
      );
    }

    if (_.has(item, 'group_id')) {
      let avatarUrl = common.cloudinary.prepare(item.avatar, 160);
      return (
        <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}
              key={'group' + item.group_id}
          >
          <View style={{position: 'relative', marginHorizontal: 2}}>
            <Image style={{width: 160, height: 130, position: 'absolute', top: 0, left: 0}} source={{uri: avatarUrl}}/>
            <TouchableHighlight underlayColor='transparent'
                                onPress={() => app.trigger('joinGroup', item.group_id)}
                                style={{width: 160, height: 130}}
                                >
              <Image style={{width: 60, height: 60, position: 'absolute', top: 15, left: 50}} source={{uri: avatarUrl}}/>
            </TouchableHighlight>
          </View>
          <TouchableHighlight underlayColor='transparent'
                              style={{width: 80, alignSelf:'center', marginTop: 5}}
                              onPress={() => app.trigger('joinGroup', item.group_id)}
            >
            <Text style={{backgroundColor: '#E7ECF3', textAlign:'center', marginVertical:2, marginHorizontal:2, borderRadius: 4, paddingHorizontal: 3, paddingVertical: 3}}>JOIN</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return null;
  }


  _renderActionSheet (user) {
    if (this.props.parentType === 'group') {
      userActionSheet.openActionSheet(this.context.actionSheet(), 'groupUsers', this.props.id, user, this.props.isOwnerAdminOrOp);
    } else {
      userActionSheet.openActionSheet(this.context.actionSheet(), 'roomUsers', this.props.id, user, this.props.isOwnerAdminOrOp);
    }
  }
}

module.exports = ListItemImageList;

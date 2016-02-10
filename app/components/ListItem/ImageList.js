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
  StyleSheet,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/EvilIcons');

class ListItemImageList extends ListItemAbstract {
  _renderContent () {
    return (
      <View>
        <TouchableHighlight onPress={() => this.props.onPress()}
                            underlayColor='#DDD'
                            style={[s.listGroupItem, styles.listGroupItem]}
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

  _renderRightIcon () {
    if (!this.props.action && !this.props.iconRight) {
      return null;
    }

    return (
      <Icon
        name={'chevron-right'}
        size={35}
        color='#B3BECC'
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          paddingTop:2
        }}
        />
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
          <Text style={styles.seeAll}>{value}</Text>
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
        style={{height: 200, flex: 1, marginLeft: 10, marginTop: 20}}
        contentContainerStyle={{alignItems: 'flex-start', flex: 1}}>
        {_.map(this.props.imageList, (item) => {
          return this._renderImageButton(item);
        })}
        </ScrollView>
    );
  }

  _renderImageButton (item) {
    let data = {};
    if (_.has(item, 'user_id')) {
      data = {
        key: 'user' + item.user_id,
        onProfile: () => this._renderActionSheet(item),
        onPress: () => app.trigger('joinUser', item.user_id),
        text: 'CHAT',
        identifier: '@' + item.username,
        avatarRadius: { borderRadius: 0 }
      };
    } else if (_.has(item, 'room_id')) {
      data = {
        key: 'room' + item.room_id,
        onProfile: () => navigation.navigate('Profile', {type: 'room', id: item.room_id, identifier: item.identifier}),
        onPress: () => app.trigger('joinRoom', item.room_id),
        text: 'JOIN',
        identifier: item.identifier,
        avatarRadius: { borderRadius: 40 }
      };
    } else if (_.has(item, 'group_id')) {
      data = {
        key: 'group' + item.group_id,
        onProfile: () => app.trigger('joinGroup', item.group_id),
        onPress: () => app.trigger('joinGroup', item.group_id),
        text: 'JOIN',
        identifier: '#' + item.name,
        avatarRadius: { borderRadius: 0 }
      };
    } else {
      return null;
    }

    let avatarUrl = common.cloudinary.prepare(item.avatar, 170);
    return (
      <View style={styles.element} key={data.key}>
        <View style={{position: 'relative'}}>
          <Image style={{width: 160, height: 130, position: 'absolute', top: 0, left: 0}} source={{uri: avatarUrl}}/>
          <TouchableHighlight underlayColor='transparent'
                              onPress={data.onProfile}
                              style={{width: 160, height: 130}}
            >
            <Image style={[{width: 80, height: 80, position: 'absolute', top: 15, left: 40}, data.avatarRadius]} source={{uri: avatarUrl}}/>
          </TouchableHighlight>
          {this._renderMode(item)}
        </View>
        <View style={styles.identifier}>
          <Text style={styles.identifierText}>{data.identifier}</Text>
        </View>
        <TouchableHighlight underlayColor='transparent'
                            style={styles.button}
                            onPress={data.onPress}
          >
          <Text style={styles.buttonText}>{data.text}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  _renderMode(item) {
    if (!_.has(item, 'room_id') || !_.has(item, 'mode') || item.mode === 'public') {
      return (null);
    }

    return (
      <Icon
        name={'lock'}
        size={30}
        color='#FFF'
        style={{
          position: 'absolute',
          top:10,
          right:10
        }}
        />
    );
  }

  _renderActionSheet (user) {
    if (this.props.parentType === 'group') {
      userActionSheet.openActionSheet(this.context.actionSheet(), 'groupUsers', this.props.id, user, this.props.isOwnerAdminOrOp);
    } else {
      userActionSheet.openActionSheet(this.context.actionSheet(), 'roomUsers', this.props.id, user, this.props.isOwnerAdminOrOp);
    }
  }
}

var styles = StyleSheet.create({
  listGroupItem: {
    borderColor: '#E7ECF3'
  },
  element: {
    marginHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    shadowColor: 'rgb(28,36,47)',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 3,
    shadowOpacity: 0.15
  },
  identifier: {
    alignSelf:'center',
    position: 'absolute',
    width: 160,
    height: 19, // 38px
    top: 100
  },
  seeAll: {
    color: '#B3BECC',
    fontFamily: 'Open Sans',
    fontSize: 14
  },
  identifierText: {
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    textShadowColor: '#AAAAAA',

    backgroundColor: 'transparent',
    fontFamily: 'Open sans',
    fontWeight: '600', // semi-bold
    fontSize: 14, // 28px
    color: '#FFFFFF',
    lineHeight: 13, // 26px
    textAlign: 'center'
  },
  button: {
    alignSelf:'center',
    marginTop: 10,
    marginBottom: 10,
    width: 110,
    height: 35, // 70px
    backgroundColor: '#E7ECF3',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  buttonText: {
    textAlign:'center',
    fontSize: 14, // 28px
    fontFamily: 'Open sans',
    fontWeight: '600', // semi-bold
    color: '#353F4C',
    letterSpacing: 1, // 2px
    lineHeight: 21 // 42px
  }
});

module.exports = ListItemImageList;

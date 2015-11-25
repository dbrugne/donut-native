'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ActivityIndicatorIOS,
  TouchableHighlight,
  Component,
  Image,
  ScrollView
  } = React;
var {
  Icon
  } = require('react-native-icons');

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/mobile-current-user');
var navigation = require('../libs/navigation');
var s = require('./style');

class RoomProfileView extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
  }

  render() {
    var data = this.data;
    var avatarUrl = common.cloudinary.prepare(data.avatar, 120);
    var description = _.unescape(data.description);

    var website = null;
    if (data.website) {
      // @todo implement website link
      website = (
        <TouchableHighlight >
          <View style={s.listGroupItem}>
            <Icon
              name='fontawesome|link'
              size={14}
              color='#333'
              style={s.listGroupItemIcon}
              />
            <Text style={s.listGroupItemText}> {data.website.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}}/>
          <Text style={styles.identifier}>{data.identifier}</Text>
          <TouchableHighlight onPress={() => { this.props.navigator.replace(navigation.getProfile({type: 'user', id: data.owner_id, identifier: '@' + data.owner_username})); }}>
            <Text>
              <Text>by </Text>
              <Text style={styles.ownerUsername}>@{data.owner_username}</Text>
            </Text>
          </TouchableHighlight>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={s.listGroup}>
          {website}
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'nowrap'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
    borderColor: '#DCDCDC',
    borderWidth: 2
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  },
  ownerUsername: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  description: {
    marginVertical: 10,
    marginHorizontal: 10,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 16,
    textAlign: 'justify'
  },
  icon: {
    width: 14,
    height: 14
  }
});

module.exports = RoomProfileView;

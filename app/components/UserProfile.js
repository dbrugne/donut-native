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
  ScrollView,
  ListView
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

class UserProfileView extends Component {
  constructor (props) {
    super(props);

    this.data = props.data;
  }
  render () {
    var data = this.data;
    var avatarUrl = common.cloudinary.prepare(data.avatar, 120);

    var realname = null;
    if (data.realname) {
      realname = (
        <Text style={styles.realname}>{data.realname}</Text>
      );
    }

    var statusText = (
      <Text style={styles.statusText}> Offline</Text>
    );
    if (data.status && data.status === 'online') {
      statusText = (
        <Text style={styles.statusText}> Offline</Text>
      );
    }

    var bio = _.unescape(data.bio);

    var location = null;
    if (data.location) {
      location = (
        <View style={s.listGroupItem}>
          <Icon
            name='fontawesome|map-marker'
            size={14}
            color='#333'
            style={s.listGroupItemIcon}
            />
          <Text style={s.listGroupItemText}>{data.location}</Text>
        </View>
      );
    }

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
            <Text style={s.listGroupItemText}>{data.website.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}} />
          {realname}
          <Text style={[styles.username, data.realname && styles.usernameGray ]}>@{data.username}</Text>
          <View style={styles.status}>
            <Icon
              name='fontawesome|circle-o'
              size={14}
              color='#333'
              style={[styles.icon, (data.status && data.status === 'online') && styles.iconOnline]}
              />
            {statusText}
          </View>
          <Text style={styles.bio}>{bio}</Text>
        </View>
        <View style={s.listGroup}>
          {location}
          {website}
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  realname: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  status: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 18
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  iconOnline: {
    color: '#4fedc0'
  },
  bio: {
    marginVertical: 10,
    marginHorizontal: 10,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 16,
    textAlign: 'justify'
  }
});

module.exports = UserProfileView;

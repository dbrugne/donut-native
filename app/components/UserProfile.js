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

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/mobile-current-user');
var navigation = require('../libs/navigation');

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


    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}} />
          <Text style={styles.username}>{data.username}</Text>

          {realname}

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
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  },
  realname: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

module.exports = UserProfileView;

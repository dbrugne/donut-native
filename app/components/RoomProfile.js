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

class RoomProfileView extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
  }

  render() {
    var data = this.data;
    var avatarUrl = common.cloudinary.prepare(data.avatar, 120);
    var description = data.description || data.bio;
    description = _.unescape(description);

    var website = null;
    if (data.website) {
      website = (
        <TouchableHighlight >
          <View style={styles.linkContainer}>
            <Icon
              name='fontawesome|link'
              size={14}
              color='#333'
              style={styles.icon}
              />
            <Text style={styles.title}> {data.website.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}}/>
          <Text style={styles.identifier}>{data.identifier}</Text>
          <TouchableHighlight style={styles.owner} onPress={() => { this.props.navigator.replace(navigation.getProfile({type: 'user', id: data.owner_id, identifier: '@' + data.owner_username})); }}>
            <Text>
              <Text>by </Text>
              <Text style={styles.ownerUsername}>@{data.owner_username}</Text>
            </Text>
          </TouchableHighlight>

          {website}

          <Text style={styles.description}>{description}</Text>

          <View style={styles.actions}>
            <TouchableHighlight >
              <View style={styles.linkContainer}>
                <Icon
                  name='fontawesome|pencil'
                  size={14}
                  color='#333'
                  style={styles.icon}
                  />
                <Text style={styles.title}> Editer</Text>
              </View>
            </TouchableHighlight>
          </View>

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
  linkContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  owner: {},
  ownerUsername: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  description: {
    marginVertical: 15,
    marginHorizontal: 9,
    textAlign: 'justify'
  },
  icon: {
    width: 14,
    height: 14
  },
  actions: {
    marginTop: 5,
    paddingTop: 5,
    borderColor: '#333333',
    borderStyle: 'solid',
    borderTopWidth: 1
  }
});

module.exports = RoomProfileView;

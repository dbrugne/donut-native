'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
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
var date = require('../libs/date');

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

    var createdAt = (
      // @todo fix i18next call (for dates rendering)
      <View style={s.listGroupItem}>
        <Icon
          name='fontawesome|clock-o'
          size={14}
          color='#333'
          style={s.listGroupItemIcon}
          />
        <Text style={s.listGroupItemText}> créé le {date.longDateTime(data.created)}</Text>
      </View>
    );

    var links = null;
    if (currentUser.get('user_id') === data.owner_id || currentUser.isAdmin()) {
      // @todo implement onpress goto room edit
      // @todo implement onpress goto room users
      // @todo implement onpress goto room access
      // @todo implement onpress goto room delete
      links = (
        <View>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|pencil'
                size={14}
                color='#333'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> éditer</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|users'
                size={14}
                color='#333'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> gérer les utilisateurs</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|key'
                size={14}
                color='#333'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> accès</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|trash-o'
                size={14}
                color='#333'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> supprimer ce donut</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    // @todo implement permalink link
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
        <TouchableHighlight style={s.button} onPress={() => app.trigger('joinRoom', data.room_id)}>
          <View style={s.buttonLabel}>
            <Text style={s.buttonText}>Rejoindre {data.users_count} </Text>
            <Icon
              name='fontawesome|user'
              size={20}
              color='#ffda3e'
              style={s.buttonIcon}
              />
          </View>
        </TouchableHighlight>
        <View style={s.listGroup}>
          {website}
          {createdAt}
          <TouchableHighlight >
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|link'
                size={14}
                color='#333'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> permalien de ce profil</Text>
            </View>
          </TouchableHighlight>
          {links}
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
    marginVertical: 20,
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

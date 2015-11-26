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
var s = require('../styles/style');
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
          <View style={[s.listGroupItem, s.listGroupItemFirst]}>
            <Icon
              name='fontawesome|link'
              size={14}
              color='#333'
              style={s.listGroupItemIcon}
              />
            <Text style={s.listGroupItemText}> {data.website.title}</Text>
            <Icon
              name='fontawesome|chevron-right'
              size={14}
              color='#DDD'
              style={s.listGroupItemIconRight}
              />
          </View>
        </TouchableHighlight>
      );
    }

    var createdAt = (
      // @todo fix i18next call (for dates rendering)
      <View style={[s.listGroupItem, !data.website && s.listGroupItemFirst]}>
        <Icon
          name='fontawesome|clock-o'
          size={14}
          color='#333'
          style={s.listGroupItemIcon}
          />
        <Text style={s.listGroupItemText}> créé le {date.longDateTime(data.created)}</Text>
      </View>
    );

    var permalink = (
      <TouchableHighlight >
        <View style={s.listGroupItem}>
          <Icon
            name='fontawesome|link'
            size={14}
            color='#333'
            style={s.listGroupItemIcon}
            />
          <Text style={s.listGroupItemText}> permalien de ce profil</Text>
          <Icon
            name='fontawesome|chevron-right'
            size={14}
            color='#DDD'
            style={s.listGroupItemIconRight}
            />
        </View>
      </TouchableHighlight>
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
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
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
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
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
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
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
              <Icon
                name='fontawesome|chevron-right'
                size={14}
                color='#DDD'
                style={s.listGroupItemIconRight}
                />
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
        <View style={styles.container2}>
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
            {permalink}
            {links}
          </View>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  container2: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DDD',
    paddingTop: 10
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
    fontSize: 16
  },
  icon: {
    width: 14,
    height: 14
  }
});

module.exports = RoomProfileView;

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
var hyperlink = require('../libs/hyperlink');
var Button = require('../elements/Button');
var Link = require('../elements/Link');
var ListItem = require('../elements/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'created-on': 'created on __date__',
  'edit': 'edit',
  'manage-users': 'manage users',
  'access': 'access',
  'delete': 'supprimer ce donut',
  'by': 'by',
  'join': 'join'
});

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
      website = (
        <ListItem
          text={data.website.title}
          type='edit-button'
          first={true}
          action={true}
          onPress={() => hyperlink.open(data.website.href)}
          icon='fontawesome|link'
          />
      );
    }

    var createdAt = (
    <ListItem
      text={i18next.t('local:created-on', {date: date.longDateTime(data.created)})}
      icon='fontawesome|clock-o'
      />
    );

    var links = null;
    if (currentUser.get('user_id') === data.owner_id || currentUser.isAdmin()) {
      // @todo implement onpress goto room edit
      // @todo implement onpress goto room users
      // @todo implement onpress goto room access
      // @todo implement onpress goto room delete
      links = (
        <View>
          <ListItem
            text={i18next.t('local:edit')}
            type='edit-button'
            action={true}
            icon='fontawesome|pencil'
            />

          <ListItem
            text={i18next.t('local:manage-users')}
            type='edit-button'
            action={true}
            icon='fontawesome|users'
            />

          <ListItem
            text={i18next.t('local:access')}
            type='edit-button'
            action={true}
            icon='fontawesome|key'
            />

          <ListItem
            text={i18next.t('local:delete')}
            type='edit-button'
            action={true}
            icon='fontawesome|trash-o'
            />

        </View>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}}/>
          <Text style={styles.identifier}>{data.identifier}</Text>
          <Link onPress={() => { this.props.navigator.replace(navigation.getProfile({type: 'user', id: data.owner_id, identifier: '@' + data.owner_username})); }}
                prepend={i18next.t('local:by')}
                text= {'@' + data.owner_username}
                type='bold'
            />

          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.container2}>
          <Button onPress={() => app.trigger('joinRoom', data.room_id)}
                  type='white'
                  label={i18next.t('local:join')+' '+data.users_count}
                  icon='fontawesome|user'
            />

          <View style={s.listGroup}>
            {website}
            {createdAt}
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

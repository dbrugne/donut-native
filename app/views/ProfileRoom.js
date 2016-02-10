'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  Image,
  ScrollView
} = React;

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var DiscussionHeader = require('./DiscussionHeader');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'profileRoom', {
  'created-on': 'created on __date__',
  'edit': 'edit',
  'manage-users': 'manage users',
  'access': 'access',
  'delete': 'delete this discussion',
  'by': 'by',
  'join': 'join'
});

class RoomProfileView extends Component {
  constructor (props) {
    super(props);

    this.data = props.data;
  }

  render () {
    var data = this.data;
    var description = _.unescape(data.description);

    var website = null;
    if (data.website) {
      website = (
        <ListItem
          text={data.website.title}
          type='edit-button'
          first={!data.users_count}
          action
          onPress={() => hyperlink.open(data.website.href)}
          icon='link'
        />
      );
    }

    var numberOfUsers = null;
    if (data.users_count) {
      numberOfUsers = (
        <ListItem
          text={'' + data.users_count}
          type='text'
          first
          icon='user'
          iconColor='#f1c40f'
          />
      );
    }

    var createdAt = (
    <ListItem
      text={i18next.t('profileRoom:created-on', {date: date.shortDate(data.created)})}
      type='text'
      icon='clock-o'
      />
    );

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <DiscussionHeader data={data} />

          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={s.listGroup}>
          <Text style={s.listGroupItemSpacing} />
          <ListItem
            text={i18next.t('profileRoom:join')}
            type='edit-button'
            first
            action
            last
            onPress={() => app.trigger('joinRoom', data.room_id)}
            />
          <Text style={s.listGroupItemSpacing} />
          {numberOfUsers}
          {website}
          {createdAt}
        </View>
      </ScrollView>
    );
  }

  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 130);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
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
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10
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

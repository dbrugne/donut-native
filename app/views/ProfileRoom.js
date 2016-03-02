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
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
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
          imageLeft={require('../assets/icon-link.png')}
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
        imageLeft={require('../assets/icon-users.png')}
        />
      );
    }

    var createdAt = (
    <ListItem
      text={i18next.t('profileRoom:created-on', {date: date.shortDate(data.created)})}
      type='text'
      imageLeft={require('../assets/icon-time.png')}
      last
      />
    );

    return (
      <ScrollView style={styles.main}>
        <DiscussionHeader data={data}>
          <Button
            label={i18next.t('profileRoom:join')}
            type='white'
            onPress={() => app.trigger('joinRoom', data.room_id)}
            style={{ alignSelf: 'stretch', marginHorizontal: 20, marginTop: 20 }}
            />
        </DiscussionHeader>

        <View style={s.listGroup}>
          <Text style={styles.description}>{description}</Text>
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
    var avatarUrl = common.cloudinary.prepare(avatar, 150);
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
    flexWrap: 'wrap'
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
    marginHorizontal: 20,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14
  }
});

module.exports = RoomProfileView;

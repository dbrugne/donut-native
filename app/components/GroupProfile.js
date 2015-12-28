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
var currentUser = require('../models/current-user');
var navigation = require('../libs/navigation');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var Button = require('../elements/Button');
var Link = require('../elements/Link');
var ListItem = require('../elements/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'created': 'created on',
  'edit': 'edit',
  'manage-users': 'manage users',
  'access': 'access',
  'by': 'by',
  'join': 'join'
});

class GroupProfileView extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
    this.members_count = (this.data.members && this.data.members.length) ? this.data.members.length : '';
  }

  render() {
    var data = this.data;
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
      text={i18next.t('local:created-on', {date: date.longDate(data.created)})}
      icon='fontawesome|clock-o'
      />
    );

    var links = null;
    if (currentUser.get('user_id') === data.owner_id || currentUser.isAdmin()) {
      // @todo implement onpress goto group edit
      // @todo implement onpress goto group users
      // @todo implement onpress goto group access
      links = (
        <View>
          <ListItem
            onPress={() => console.log('todo implement group edit')}
            text={i18next.t('local:edit')}
            type='edit-button'
            action={true}
            icon='fontawesome|pencil'
            />

          <ListItem
            onPress={() => console.log('todo implement group users')}
            text={i18next.t('local:manage-users')}
            type='edit-button'
            action={true}
            icon='fontawesome|users'
            />

          <ListItem
            onPress={() => console.log('todo implement group access')}
            text={i18next.t('local:access')}
            type='edit-button'
            action={true}
            icon='fontawesome|key'
            />
        </View>
      );
    }

    // @todo implement joinGroup @spariaud
    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          {this._renderAvatar(data.avatar)}
          <Text style={styles.identifier}>{data.identifier}</Text>
          <Link onPress={() => { this.props.navigator.replace(navigation.getProfile({type: 'user', id: data.owner_id, identifier: '@' + data.owner_username})) }}
                prepend={i18next.t('local:by')}
                text={'@' + data.owner_username}
                type='bold'
            />
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={s.listGroup}>
          <Text style={s.listGroupItemSpacing}></Text>
          <ListItem
            text={i18next.t('local:join')+' '+this.members_count}
            type='edit-button'
            first={true}
            action={true}
            onPress={() => app.trigger('joinUser', data.user_id)}
            icon='fontawesome|user'
            iconColor='#f1c40f'
            />

          <Text style={s.listGroupItemSpacing}></Text>
          {website}
          {createdAt}
          {links}
        </View>
      </ScrollView>
    );
  }


  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 120);
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
    marginVertical: 10,
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

module.exports = GroupProfileView;

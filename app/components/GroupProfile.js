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
    this.members_count = (this.data.members && this.data.members.length) ? this.data.members.length : 0;

    // ... grade  ...
    this.isMember = (this.members_count) ? !!(_.indexOf(this.data.members, currentUser.get('user_id'))) : false;
    this.isOwner = currentUser.get('user_id') === this.data.owner_id;
    this.isAdmin = currentUser.isAdmin();
    this.isOp = this.isCurrentUserIsOP();
    console.log('isMember: ' + this.isMember);
    console.log('isOwner: ' + this.isOwner);
    console.log('isAdmin: ' + this.isAdmin);
    console.log('isOp: ' + this.isOp);
  }

  render() {
    var data = this.data;
    var avatarUrl = common.cloudinary.prepare(data.avatar, 120);
    var description = _.unescape(data.description);

    var website = null;
    if (data.website) {
      website = (
        <TouchableHighlight underlayColor='transparent'
                            onPress={() => hyperlink.open(data.website.href)}>
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
      <View style={[s.listGroupItem, !data.website && s.listGroupItemFirst]}>
        <Icon
          name='fontawesome|clock-o'
          size={14}
          color='#333'
          style={s.listGroupItemIcon}
          />
        <Text style={s.listGroupItemText}> {i18next.t('local:created')} {date.longDateTime(data.created)}</Text>
      </View>
    );

    var links = null;
    if (currentUser.get('user_id') === data.owner_id || currentUser.isAdmin()) {
      // @todo implement onpress goto group edit
      // @todo implement onpress goto group users
      // @todo implement onpress goto group access
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
              <Text style={s.listGroupItemText}> {i18next.t('local:edit')}</Text>
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
              <Text style={s.listGroupItemText}> {i18next.t('local:manage-users')}</Text>
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
              <Text style={s.listGroupItemText}> {i18next.t('local:access')}</Text>
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

    // @todo implement joinGroup @spariaud
    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}}/>
          <Text style={styles.identifier}>{data.identifier}</Text>
          <Link onPress={() => { navigation.switchTo(navigation.getProfile({type: 'user', id: data.owner_id, identifier: '@' + data.owner_username})) }}
                prepend={i18next.t('local:by')}
                text={'@' + data.owner_username}
                type='bold'
            />
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.container2}>
          <TouchableHighlight style={s.button} onPress={() => this.props.navigator.push(navigation.getGroupAskMembership(data.group_id))}>
            <View style={s.buttonLabel}>
              <Text style={s.buttonText}>Devenir membre</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={s.button}>
            <View style={s.buttonLabel}>
              <Text style={s.buttonText}>Liste des donuts</Text>
            </View>
          </TouchableHighlight>
          <View style={s.listGroup}>
            {website}
            {createdAt}
            {links}
          </View>
        </View>
      </ScrollView>
    );
  }

  isCurrentUserIsOP () {
    if (!this.members_count) {
      return false;
    }
    return !!_.find(this.data.members, function (item) {
      return (item.user_id === currentUser.get('user_id') && item.is_op === true);
    });
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

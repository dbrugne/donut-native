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

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'registered': 'registered on',
  'unlock': 'débloquer cet utilisateur',
  'lock': 'bloquer cet utilisateur',
  'blocked': 'cet utilisateur vous a bloqué',
  'discuss': 'discuter'
});

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

    var status = (
      <View style={styles.status}>
        <Icon
          name='fontawesome|circle-o'
          size={14}
          color='#c7c7c7'
          style={[styles.icon, (data.status && data.status === 'online') && styles.iconOnline]}
          />
        <Text style={styles.statusText}> {i18next.t('offline')}</Text>
      </View>
    );
    if (data.status && data.status === 'online') {
      status = (
        <View style={styles.status}>
          <Icon
            name='fontawesome|circle'
            size={14}
            color='#4fedc0'
            style={[styles.icon, (data.status && data.status === 'online') && styles.iconOnline]}
            />
          <Text style={styles.statusText}> {i18next.t('online')}</Text>
        </View>
      );
    }

    var bio = _.unescape(data.bio);

    var location = null;
    if (data.location) {
      location = (
        <View style={[s.listGroupItem, s.listGroupItemFirst]}>
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
      website = (
        <TouchableHighlight underlayColor='transparent'
                            onPress={() => hyperlink.open(data.website.href)}>
          <View style={[s.listGroupItem, !data.location && s.listGroupItemFirst]}>
            <Icon
              name='fontawesome|link'
              size={14}
              color='#333'
              style={s.listGroupItemIcon}
              />
            <Text style={s.listGroupItemText}>{data.website.title}</Text>
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

    var registeredAt = (
      // @todo fix i18next call (for dates rendering)
      <View style={[s.listGroupItem, (!data.location && !data.website) && s.listGroupItemFirst]}>
        <Icon
          name='fontawesome|clock-o'
          size={14}
          color='#333'
          style={s.listGroupItemIcon}
          />
        <Text style={s.listGroupItemText}> {i18next.t('local:registered')} {date.longDateTime(data.registered)}</Text>
      </View>
    );

    var bannedLink = null;
    if (data.banned === true) {
      // @todo implement ban / deban action
      bannedLink = (
        <View>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|ban'
                size={14}
                color='#ff3838'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> {i18next.t('local:unlock')}</Text>
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
    } else {
      // @todo implement ban / deban action
      bannedLink = (
        <View>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Icon
                name='fontawesome|ban'
                size={14}
                color='#ff3838'
                style={s.listGroupItemIcon}
                />
              <Text style={s.listGroupItemText}> {i18next.t('local:lock')}</Text>
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

    var isBannedLink = null;
    if (data.i_am_banned === true) {
      // @todo implement ban / deban action
      isBannedLink = (
        <View>
          <TouchableHighlight>
            <View style={s.listGroupItem}>
              <Text style={[s.listGroupItemText, s.clError]}>{i18next.t('local:blocked')}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}} />
          {realname}
          <Text style={[styles.username, data.realname && styles.usernameGray ]}>@{data.username}</Text>
          {status}
          <Text style={styles.bio}>{bio}</Text>
        </View>
        <View style={styles.container2}>

          <Button onPress={() => app.trigger('joinUser', data.user_id)}
                  type='white'
                  label={i18next.t('local:discuss')}
            />

          <View style={s.listGroup}>
            {location}
            {website}
            {registeredAt}
            {bannedLink}
            {isBannedLink}
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
    fontSize: 16
  }
});

module.exports = UserProfileView;

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ScrollView
  } = React;

var _ = require('underscore');
var app = require('../libs/app');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var ListItem = require('../components/ListItem');
var UserHeader = require('./UserHeader');
var currentUser = require('../models/current-user');
var navigation = require('../navigation/index');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'ProfileUser', {
  'registered-on': 'registered on __date__',
  'unlock': 'unblock this user',
  'lock': 'block this user',
  'blocked': 'this user blocked you',
  'report': 'report user'
});

var UserProfileView = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      banned: this.props.data.banned
    };
  },
  render () {
    var bio = _.unescape(this.props.data.bio);

    var isBannedLink = null;
    if (this.props.data.i_am_banned === true) {
      isBannedLink = (
        <Text style={{marginVertical: 5, marginHorizontal: 5, color: '#ff3838', fontFamily: 'Open Sans', fontSize: 14}}>{i18next.t('ProfileUser:blocked')}</Text>
      );
    }

    var location = null;
    if (this.props.data.location) {
      location = (
        <ListItem
          text={_.unescape(this.props.data.location)}
          type='text'
          first
          imageLeft={require('../assets/icon-location.png')}
          />
      );
    }

    var website = null;
    if (this.props.data.website) {
      website = (
        <ListItem
          text={this.props.data.website.title}
          type='edit-button'
          onPress={() => hyperlink.open(this.props.data.website.href)}
          first={!this.props.data.location}
          action
          imageLeft={require('../assets/icon-link.png')}
          />
      );
    }

    var registeredAt = (
      <ListItem
        type='text'
        text={i18next.t('ProfileUser:registered-on', {date: date.shortDate(this.props.data.registered)})}
        first={(!this.props.data.location && !this.props.data.website)}
        imageLeft={require('../assets/icon-time.png')}
        />
    );

    return (
      <ScrollView style={styles.main}>
        <UserHeader data={this.props.data}>
          {isBannedLink}
        </UserHeader>
        <View style={[s.listGroup]}>
          <Text style={styles.bio}>{bio}</Text>
          {location}
          {website}
          {registeredAt}
          {this._renderBanned()}
          {this._renderReport()}
        </View>
      </ScrollView>
    );
  },
  _renderBanned () {
    if (this.props.data.user_id === currentUser.get('user_id')) {
      return;
    }

    return (
      <ListItem
        type='switch'
        imageLeft={require('../assets/icon-ban.png')}
        text={ this.state.banned ? i18next.t('ProfileUser:unlock') : i18next.t('ProfileUser:lock')}
        onSwitch={this._toggleBanned}
        switchValue={this.state.banned}
        />
    );
  },
  _toggleBanned () {
    // currently banned
    if (this.state.banned) {
      this._unbanUser();
    } else {
      this._banUser();
    }
  },
  _renderReport () {
    if (this.props.data.user_id === currentUser.get('user_id')) {
      return;
    }

    return (
      <ListItem
        text={i18next.t('ProfileUser:report')}
        type='edit-button'
        action
        onPress={() => navigation.navigate('Report', {type: 'user', user: this.props.data})}
        imageLeft={require('../assets/icon-ban.png')}
        />
    );
  },
  _banUser () {
    app.client.userBan(this.props.data.user_id, (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: true});
    });
  },
  _unbanUser () {
    app.client.userDeban(this.props.data.user_id, (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: false});
    });
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  bio: {
    marginVertical: 20,
    marginHorizontal: 20,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14
  }
});

module.exports = UserProfileView;

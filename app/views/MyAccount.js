'use strict';

var React = require('react-native');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var imageUpload = require('../libs/imageUpload');
var LoadingView = require('../components/Loading');
var Alert = require('../libs/alert');

var {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableHighlight
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccount', {
  'change-preferences': 'Custom notifications',
  'login': 'LOGIN AND EMAILS',
  'manage-emails': 'Manage emails',
  'change-password': 'Change password',
  'about': 'About',
  'eutc': 'Privacy and EUTC',
  'logout': 'Logout',
  'avatar': 'Profile picture',
  'realname': 'Real name',
  'biography': 'Bio',
  'location': 'Location',
  'website': 'Website',
  'website-url': 'Wrong url',
  'profile': 'Profile details',
  'credentials': 'Credentials',
  'notifications': 'Notifications',
  'logout-title': 'End',
  'miscellaneous': 'Miscellaneous',
  'help': 'Help'
});

var MyAccountView = React.createClass({
  getInitialState: function () {
    return {
      username: currentUser.get('username'),
      realname: '',
      bio: '',
      color: '',
      avatar: '',
      location: '',
      website: {
        value: ''
      },
      loaded: false
    };
  },
  componentWillUnmount: function () {
    currentUser.off('change:avatar');
  },

  componentDidMount: function () {
    this.fetchData();
    currentUser.on('change:avatar', (model) => {
      this.setState({
        avatar: common.cloudinary.prepare(model.get('avatar'), 120)
      });
    });
  },

  fetchData: function () {
    app.client.userRead(currentUser.get('user_id'), {more: true, admin: true}, (response) => {
      this.setState({
        realname: response.realname,
        bio: response.bio,
        color: response.color,
        location: response.location,
        website: (response.website && response.website.title ? response.website.title : {value: ''}),
        avatar: common.cloudinary.prepare(response.avatar, 120),
        loaded: true
      });
    });
  },

  render: function () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    var realname = null;
    if (this.state.realname) {
      realname = (
        <Text style={styles.username}>{this.state.realname}</Text>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <TouchableHighlight
          onPress={() => navigation.navigate('Profile', {type: 'user', id: currentUser.get('user_id'), identifier: '@' + this.state.username})}
          >
        <View style={styles.containerHorizontal}>
          {this._renderAvatar(this.state.avatar)}
          <View style={styles.containerVertical}>
            {realname}
            <Text style={[styles.username, realname && styles.usernameGray]}>@{this.state.username}</Text>
          </View>
        </View>
        </TouchableHighlight>
        <View style={s.listGroup}>
          <ListItem text={i18next.t('myAccount:avatar')}
                    type='edit-button'
                    first
                    action
                    onPress={() => this._updateAvatar()}
                    title={i18next.t('myAccount:profile')}
            />
          <ListItem text={i18next.t('myAccount:realname')}
                    type='edit-button'
                    action
                    value={this.state.realname}
                    onPress={() => this.onUserEdit(require('./MyAccountEditRealname'), this.state.realname)}
            />

          <ListItem text={i18next.t('myAccount:biography')}
                    type='edit-button'
                    action
                    value={this.state.bio}
                    onPress={() => this.onUserEdit(require('./MyAccountEditBio'), this.state.bio)}
            />

          <ListItem text={i18next.t('myAccount:location')}
                    type='edit-button'
                    action
                    value={this.state.location}
                    onPress={() => this.onUserEdit(require('./MyAccountEditLocation'), this.state.location)}
            />

          <ListItem text={i18next.t('myAccount:website')}
                    type='edit-button'
                    action
                    last
                    value={this.state.website}
                    onPress={() => this.onUserEdit(require('./MyAccountEditWebsite'), this.state.website)}
            />
          </View>
          <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('MyAccountPreferences')}
            text={i18next.t('myAccount:change-preferences')}
            action
            type='button'
            first
            title={i18next.t('myAccount:notifications')}
            />
          </View>
        <View style={s.listGroup}>
          <ListItem
            onPress={() => navigation.navigate('MyAccountEmails')}
            text={i18next.t('myAccount:manage-emails')}
            action
            type='button'
            first
            title={i18next.t('myAccount:credentials')}
            />
          <ListItem
            onPress={() => navigation.navigate('MyAccountPassword')}
            text={i18next.t('myAccount:change-password')}
            action
            type='button'
            />
          </View>
          <View style={s.listGroup}>
            <ListItem text={i18next.t('myAccount:eutc')}
                      type='button'
                      onPress={() => navigation.navigate('Eutc')}
                      title={i18next.t('myAccount:miscellaneous')}
                      first
                      action
              />
            <ListItem text={i18next.t('myAccount:help')}
                      type='button'
                      action
                      onPress={() => this.joinHelp()}
              />
            <ListItem
              onPress={() => navigation.navigate('About')}
              text={i18next.t('myAccount:about')}
              action
              type='button'
            />
          </View>
        <View style={s.listGroup}>
          <ListItem
            onPress={() => currentUser.logout()}
            text={i18next.t('myAccount:logout')}
            type='button'
            warning
            first
            title={i18next.t('myAccount:logout-title')}
          />
        </View>
      </ScrollView>
    );
  },

  _renderAvatar: function (avatar) {
    if (!avatar) {
      return null;
    }

    return (
      <Image style={styles.image} source={{uri: avatar}}/>
    );
  },

  _updateAvatar: function () {
    imageUpload.getImageAndUpload('user,avatar', null, (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveUserData('avatar', response, () => {
      });
    });
  },

  onUserEdit: function (component, value) {
    navigation.navigate('UserField', {
      component,
      value,
      onSave: this.saveUserData.bind(this)
    });
  },

  saveUserData: function (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.userUpdate(updateData, (response) => {
      if (response.err) {
        for (var k in response.err) {
          if (response.err[k] === 'website-url') {
            Alert.show(i18next.t('myAccountEdit:website-url'));
          } else {
            Alert.show(i18next.t('messages.' + response.err[k]));
          }
        }
      } else {
        var state = {loaded: true};
        if (key !== 'avatar') {
          state[key] = value;
        }
        this.setState(state);

        if (callback) {
          callback();
        }
      }
    });
  },

  joinHelp: function () {
    app.client.roomId('#help', (data) => {
      if (data.err) {
        return Alert.show(data.err);
      }
      app.trigger('joinRoom', data.room_id);
    });
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '400'
  },
  containerHorizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10
  },
  containerVertical: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 2
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 4,
    marginRight: 10
  },
  usernameGray: {
    color: '#b6b6b6'
  }
});

module.exports = MyAccountView;

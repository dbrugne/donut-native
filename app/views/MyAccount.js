'use strict';

var React = require('react-native');
var _ = require('underscore');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var common = require('@dbrugne/donut-common/mobile');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var imageUpload = require('../libs/imageUpload');
var LoadingView = require('../components/Loading');
var UserHeader = require('./UserHeader');
var Alert = require('../libs/alert');

var {
  ScrollView,
  View,
  StyleSheet
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
  'profile': 'PROFILE DETAILS',
  'credentials': 'CREDENTIALS',
  'notifications': 'NOTIFICATIONS',
  'miscellaneous': 'MISCELLANEOUS',
  'help': 'Help',
  'silence': 'Silence',
  'language': 'Language',
  'facebook': 'Facebook'
});

var MyAccountView = React.createClass({
  getInitialState: function () {
    return {
      username: currentUser.get('username'),
      loaded: false
    };
  },
  componentDidMount: function () {
    this.fetchData();
    currentUser.on('change:avatar', (model) => {
      let data = _.clone(this.state.data);
      _.extend(data, {avatar: model.get('avatar')})
      this.setState({ data });
    });
  },
  componentWillUnmount: function () {
    currentUser.off('change:avatar');
  },
  fetchData: function () {
    app.client.userRead(currentUser.get('user_id'), {more: true, admin: true}, (data) => {
      data.website = (data.website && data.website.title ? data.website.title : '');
      this.setState({
        data,
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

    return (
      <ScrollView style={styles.main}>
        <UserHeader data={this.state.data} small/>

        <View style={{ marginTop: 40 }}>
          <ListItem text={i18next.t('myAccount:avatar')}
                    type='edit-button'
                    first
                    action
                    imageRight={common.cloudinary.prepare(this.state.data.avatar, 50)}
                    onPress={() => this._updateAvatar()}
                    title={i18next.t('myAccount:profile')}
            />
          <ListItem text={i18next.t('myAccount:realname')}
                    type='edit-button'
                    action
                    value={_.unescape(this.state.data.realname)}
                    onPress={() => this.onUserEdit(require('./MyAccountEditRealname'), _.unescape(this.state.data.realname))}
            />

          <ListItem text={i18next.t('myAccount:biography')}
                    type='edit-button'
                    action
                    value={_.unescape(this.state.data.bio)}
                    onPress={() => this.onUserEdit(require('./MyAccountEditBio'), _.unescape(this.state.data.bio))}
            />

          <ListItem text={i18next.t('myAccount:location')}
                    type='edit-button'
                    action
                    value={_.unescape(this.state.data.location)}
                    onPress={() => this.onUserEdit(require('./MyAccountEditLocation'), _.unescape(this.state.data.location))}
            />

          <ListItem text={i18next.t('myAccount:website')}
                    type='edit-button'
                    action
                    last
                    value={this.state.data.website}
                    onPress={() => this.onUserEdit(require('./MyAccountEditWebsite'), this.state.data.website)}
            />
        </View>

        <View style={{ marginTop: 40 }}>
          <ListItem
            onPress={() => navigation.navigate('MyAccountPreferences')}
            text={i18next.t('myAccount:change-preferences')}
            action
            type='button'
            first
            title={i18next.t('myAccount:notifications')}
            />
          <ListItem
            text={i18next.t('myAccount:silence')}
            type='switch'
            switchValue={false}
            onSwitch={() => navigation.navigate('AvailableSoon')}
            />
        </View>

        <View style={{ marginTop: 40 }}>
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
          <ListItem
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('myAccount:facebook')}
            action
            type='button'
            />
        </View>

        <View style={{ marginTop: 40 }}>
          <ListItem
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('myAccount:language')}
            value='English'
            action
            title={i18next.t('myAccount:miscellaneous')}
            type='edit-button'
            first
            />
          <ListItem text={i18next.t('myAccount:eutc')}
                    type='button'
                    onPress={() => navigation.navigate('Eutc')}
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

        <View style={{ marginTop: 40, marginHorizontal: 20, marginBottom: 40 }}>
          <Button
            onPress={() => currentUser.logout()}
            label={i18next.t('myAccount:logout')}
            type='gray'
            />
        </View>
      </ScrollView>
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
      onSave: (key, value, cb) => this.saveUserData(key, value, cb)
    });
  },

  saveUserData: function (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.userUpdate(updateData, (response) => {
      if (response.err) {
        for (var k in response.err) {
          Alert.show(i18next.t('messages.' + response.err[k]));
        }
        if (callback) {
          return callback(response.err);
        }
      } else {
        if (key !== 'avatar') {
          let data = _.clone(this.state.data);
          let update = {};
          update[key] = value;
          _.extend(data, update);
          this.setState({
            data: data
          });
        }

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
    flexWrap: 'wrap'
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
  username: {
    color: '#AFBAC8',
    backgroundColor: 'transparent',
    fontFamily: 'Open Sans',
    fontSize: 16,
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  realname: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '600'
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 4
  },
  statusOnline: {backgroundColor: '#18C095'},
  statusConnecting: {backgroundColor: 'rgb(255, 218, 62)'},
  statusOffline: {backgroundColor: 'rgb(119,119,119)'},
  statusText: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Open Sans',
    backgroundColor: 'transparent'
  }
});

module.exports = MyAccountView;

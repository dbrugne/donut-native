'use strict';

var React = require('react-native');
var _ = require('underscore');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
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
        avatar: common.cloudinary.prepare(model.get('avatar'), 150)
      });
    });
  },

  fetchData: function () {
    app.client.userRead(currentUser.get('user_id'), {more: true, admin: true}, (response) => {
      this.setState({
        realname: _.unescape(response.realname),
        bio: _.unescape(response.bio),
        color: response.color,
        location: _.unescape(response.location),
        website: (response.website && response.website.title ? response.website.title : ''),
        avatar: common.cloudinary.prepare(response.avatar, 150),
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
        <BackgroundComponent avatar={this.state.avatar} >
          <TouchableHighlight onPress={() => navigation.navigate('Profile', {type: 'user', id: currentUser.get('user_id'), identifier: '@' + this.state.username})}
                              underlayColor='transparent'
            >
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              {this._renderIdentifier()}
            </View>
          </TouchableHighlight>
        </BackgroundComponent>

        <View style={{ marginTop: 40 }}>
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

  _renderIdentifier() {
    if (this.state.realname) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'column'}}>
          <View style={{backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.realname}>{_.unescape(this.state.realname)}</Text>
            <View style={[styles.status, this.state.status === 'connecting' && styles.statusConnecting, this.state.status === 'offline' && styles.statusOffline, this.state.status === 'online' && styles.statusOnline]} />
            <Text style={styles.statusText}>{this.state.status}</Text>
          </View>
          <Text style={[styles.username, styles.usernameGray]}>@{this.state.username}</Text>
        </View>
      );
    }

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'column'}}>
        <View style={{backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.realname]}>@{this.state.username}</Text>
          <View style={[styles.status, this.state.status === 'connecting' && styles.statusConnecting, this.state.status === 'offline' && styles.statusOffline, this.state.status === 'online' && styles.statusOnline]} />
          <Text style={styles.statusText}>{this.state.status}</Text>
        </View>
      </View>
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

var BackgroundComponent = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    avatar: React.PropTypes.string
  },

  render: function() {
    var avatarUrl = null;
    if (this.props.avatar) {
      avatarUrl = common.cloudinary.prepare(this.props.avatar, 300);
    }

    if (avatarUrl) {
      return (
        <Image style={[styles.container, {resizeMode: 'cover'}]} source={{uri: avatarUrl}}>
          {this.props.children}
        </Image>
      );
    }

    return (
      <View style={[styles.container, {position: 'relative'}]}>
        {this.props.children}
      </View>
    );
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
  statusOnline: { backgroundColor: '#18C095' },
  statusConnecting: { backgroundColor: 'rgb(255, 218, 62)' },
  statusOffline: { backgroundColor: 'rgb(119,119,119)' },
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

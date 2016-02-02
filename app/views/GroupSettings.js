'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var s = require('../styles/style');
var ListItem = require('../components/ListItem');
var LoadingView = require('../components/Loading');
var navigation = require('../navigation/index');
var common = require('@dbrugne/donut-common/mobile');
var Alert = require('../libs/alert');
var imageUploader = require('../libs/imageUpload');
var emojione = require('emojione');

var {
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableHighlight
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupSettings', {
  'disclaimer': 'Message displayed',
  'access-title': 'Access',
  'access-disclaimer': 'Members create discussions and manage them. They can join any discussion opened to members. Note: public discussions are open to anyone.',
  'leave': 'Leave this community',
  'allow-user-request': 'Allow users to request access',
  'trusted-domains': 'Trusted e-mail domains',
  'add-password': 'Add password',
  'domain-sample': '@example.com',
  'profile-details': 'Profile details',
  'profile-picture': 'Profile picture',
  'end': 'End',
  'delete': 'Delete this community',
  'deleteTitle': 'Delete community',
  'deleteDisclaimer': 'Are you sure you whant to delete __identifier__. This action is ireversible'
}, true, true);

class GroupSettings extends Component {
  constructor (props) {
    super(props);
    this.isAdmin = app.user.isAdmin();

    this.state = {
      loaded: false
    };
  }
  componentDidMount () {
    var what = {
      rooms: true,
      users: true,
      admin: true
    };

    app.client.groupRead(this.props.model.get('id'), what, (data) => {
      if (data.err === 'group-not-found') {
        return;
      }
      this.onResponse(data);
    });
  }
  onResponse(data) {
    this.setState({
      loaded: true,
      disclaimer: data.disclaimer,
      description: data.description,
      allow_user_request: data.allow_user_request,
      allowed_domains: data.allowed_domains,
      avatar: data.avatar,
      identifier: data.identifier,
      website: data.website,
      is_member: data.is_member,
      is_op: data.is_op,
      is_owner: data.is_owner,
      new_domain: null,
      addDomainLoading: false
    });
  }
  render () {
    if (this.state.loaded === false) {
      return (<LoadingView />);
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.containerTop}>
          {this._renderAvatar(this.state.avatar)}
          <Text style={{marginTop: 10}}>{this.state.identifier}</Text>
        </View>
        {this._renderAccess()}
        <Text style={styles.listGroupItemSpacing}/>
        {this._renderProfileDetails()}
        <Text style={styles.listGroupItemSpacing}/>
        {this._renderEnd()}
      </ScrollView>
    );
  }

  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 60);
    if (!avatarUrl) {
      return null;
    }
    return (
      <TouchableHighlight onPress={() => navigation.navigate('Group', {id: this.props.model.get('id'), name: this.props.model.get('name')})}
                          underlayColor='transparent' >
        <Image style={styles.avatarGroup} source={{uri: avatarUrl}}/>
      </TouchableHighlight>
    );
  }
  _renderAccess () {
    return (
      <View style={s.listGroup}>
        <Text style={s.block}>{i18next.t('GroupSettings:access-disclaimer')}</Text>
        <ListItem text={i18next.t('GroupSettings:disclaimer')}
                  type='edit-button'
                  title={i18next.t('GroupSettings:access-title')}
                  action
                  value={this.state.disclaimer}
                  onPress={() => this.onGroupEdit(require('./GroupEditDisclaimer'), this.state.disclaimer)}
        />
        <ListItem text={i18next.t('GroupSettings:allow-user-request')}
                  type='switch'
                  onSwitch={this.saveGroupData.bind(this, 'allow_user_request', !this.state.allow_user_request)}
                  switchValue={this.state.allow_user_request}
        />
        {this._renderTrustedDomains()}
        {this._renderPassword()}
      </View>
    );
  }
  _renderTrustedDomains() {
    return (
      <View>
        <ListItem
          onPress={() => navigation.navigate('AvailableSoon')}
          text={i18next.t('GroupSettings:trusted-domains')}
          type='button'
          action
        />
      </View>
    );
  }
  _renderPassword() {
    return (
      <View>
        <ListItem
          onPress={() => navigation.navigate('AvailableSoon')}
          text={i18next.t('GroupSettings:add-password')}
          type='button'
          action
        />
      </View>
    );
  }
  onGroupEdit(component, value) {
    navigation.navigate('UserField', {
      component,
      value,
      onSave: this.saveGroupData.bind(this)
    });
  }
  saveGroupData (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.groupUpdate(this.props.model.get('id'), updateData, (response) => {
      if (response.err) {
        return null;
      }

      var state = {loaded: true};
      if (key !== 'avatar') {
        state[key] = value;
      }
      this.setState(state);

      if (callback) {
        callback();
      }
    });
  }
  _renderProfileDetails () {
    return (
      <View style={s.listGroup}>
        <ListItem text={i18next.t('GroupSettings:profile-picture')}
                  type='edit-image'
                  title={i18next.t('GroupSettings:profile-details')}
                  action
                  first
                  avatar={this.state.avatar}
                  onPress={() => this._pickImage()}
        />
      </View>
    );
  }
  _renderEnd () {
    var deleteGroupLink = null;
    if (this.state.is_op || this.state.is_owner || this.isAdmin) {
      deleteGroupLink = (
        <ListItem
          onPress={() => this.deleteGroup()}
          text={i18next.t('GroupSettings:delete')}
          type='button'
          first
          warning
        />
      );
    }

    return (
      <View style={s.listGroup}>
        <ListItem
          onPress={() => this.props.model.leave()}
          text={i18next.t('GroupSettings:leave')}
          type='button'
          first
          warning
          title={i18next.t('GroupSettings:end')}
        />
        {deleteGroupLink}
      </View>
    );
  }

  //_renderLinks () {
  //  if (this.props.model.get('type') === 'onetoone') {
  //    return (
  //      <View style={s.listGroup}>
  //        <ListItem
  //          onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('id'), identifier: this.state.identifier})}
  //          text={i18next.t('GroupSettings:see')}
  //          icon='eye'
  //          type='button'
  //          first
  //          action
  //          />
  //        {this._renderBlock()}
  //      </View>
  //    );
  //  } else {
  //    let itemTopic = null;
  //    if (this.state.is_op || this.state.is_owner || this.isAdmin) {
  //      itemTopic = (
  //        <View>
  //          <ListItem
  //            onPress={() => navigation.navigate('AvailableSoon')}
  //            text={i18next.t('GroupSettings:access')}
  //            icon='users'
  //            type='button'
  //            action
  //            title={i18next.t('GroupSettings:users-title')}
  //            first
  //            />
  //          {this._renderAllowedUsers()}
  //        </View>
  //      );
  //    }
  //    return (
  //      <View style={s.listGroup}>
  //        {itemTopic}
  //      </View>
  //    );
  //  }
  //}
  //_renderTopic () {
  //  if (this.props.model.get('type') === 'onetoone') {
  //    return null;
  //  }
  //
  //  var topic;
  //  if (this.state.topic) {
  //    topic = common.markup.toText(this.state.topic);
  //    topic = emojione.shortnameToUnicode(topic);
  //  }
  //  if (!topic) {
  //    topic = i18next.t('GroupSettings:no-topic');
  //  }
  //
  //  if (!this.state.is_op && !this.state.is_owner && !this.isAdmin) {
  //    return (
  //      <View style={[s.listGroup, {alignItems: 'center'}]}>
  //        <Text style={s.topic}>{topic}</Text>
  //      </View>
  //    );
  //  } else {
  //    return (
  //      <View style={s.listGroup}>
  //        <ListItem
  //          onPress={() => navigation.navigate('RoomTopic', this.props.model, () => this.fetchData())}
  //          text={topic}
  //          type='button'
  //          action
  //          first
  //          title={i18next.t('GroupSettings:topic')}
  //          />
  //      </View>
  //    );
  //  }
  //}
  //_renderAllowedUsers () {
  //  return (
  //    <ListItem
  //        onPress={() => navigation.navigate('AvailableSoon')}
  //        text={i18next.t('GroupSettings:allowed')}
  //        icon='shield'
  //        type='button'
  //        action
  //      />
  //  );
  //}
  //_renderEdition () {
  //  if (this.props.model.get('type') === 'onetoone') {
  //    return null;
  //  }
  //  if (!this.state.is_op && !this.state.is_owner && !this.isAdmin) {
  //    return null;
  //  }
  //  return (
  //    <View style={s.listGroup}>
  //      <ListItem
  //        onPress={() => this._pickImage()}
  //        text={i18next.t('GroupSettings:avatar')}
  //        type='edit-button'
  //        action
  //        first
  //        title={i18next.t('GroupSettings:details')}
  //        />
  //      <ListItem
  //        onPress={() => navigation.navigate('RoomEditDescription', this.props.model.get('id'), (key, value) => this.saveRoomData(key, value))}
  //        text={i18next.t('GroupSettings:description')}
  //        type='edit-button'
  //        action
  //        />
  //      <ListItem
  //        onPress={() => navigation.navigate('RoomEditWebsite', this.props.model.get('id'), (key, value) => this.saveRoomData(key, value))}
  //        text={i18next.t('GroupSettings:website')}
  //        type='edit-button'
  //        action
  //        />
  //    </View>
  //  );
  //}
  _pickImage () {
    imageUploader.getImageAndUpload('room,avatar', null, (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveGroupData('avatar', response, () => {
        this.setState({avatar: 'https://res.cloudinary.com/roomly/image/upload/h_30,w_30/' + response.path});
      });
    });
  }
  //saveRoomData (key, value, callback) {
  //  var updateData = {};
  //  updateData[key] = value;
  //
  //  app.client.roomUpdate(this.props.model.get('id'), updateData, (response) => {
  //    if (response.err) {
  //      for (var k in response.err) {
  //        if (response.err[k] === 'website-url') {
  //          Alert.show(i18next.t('RoomEdit:website-url'));
  //        } else {
  //          Alert.show('messages.unknown');
  //        }
  //      }
  //      return;
  //    }
  //
  //    var object = {};
  //    object[key] = value;
  //    this.setState(object);
  //    if (callback) {
  //      callback();
  //    }
  //  });
  //}

  deleteGroup () {
    Alert.askConfirmation(
      i18next.t('GroupSettings:deleteTitle'),
      i18next.t('GroupSettings:deleteDisclaimer', {identifier: this.props.model.get('identifier')}),
      () => app.client.groupDelete(this.props.model.get('id'), () => {}),
      () => {}
    );
  }
}

GroupSettings.propTypes = {model: React.PropTypes.object};

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 10
  },
  containerTop: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10
  },
  avatarGroup: {
    width: 50,
    height: 50,
    borderRadius: 3
  },
  //containerAvatarOne: {
  //  flexDirection: 'column'
  //},
  //avatarOne: {
  //  width: 50,
  //  height: 50
  //},
  //status: {
  //  marginBottom: 8,
  //  alignSelf: 'center',
  //  textAlign: 'center',
  //  flex: 1,
  //  fontWeight: '400',
  //  fontSize: 12,
  //  fontFamily: 'Open Sans',
  //  width: 50,
  //  paddingLeft: 5,
  //  paddingRight: 5,
  //  overflow: 'hidden'
  //},
  //statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  //statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  //statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  //statusText: {
  //  color: '#FFFFFF',
  //  fontWeight: '500',
  //  fontSize: 16,
  //  fontFamily: 'Open Sans'
  //}
});

module.exports = GroupSettings;

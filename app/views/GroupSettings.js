'use strict';
var React = require('react-native');
var _ = require('underscore');
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
  'description': 'Description',
  'website': 'Website',
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
  'deleteDisclaimer': 'Are you sure you whant to delete __identifier__. This action is ireversible',
  'website-url': 'Wrong url'
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
    var atLeastOne = false;
    _.find(app.rooms.toJSON(), (room) => {
      if (room.group_id) {
        atLeastOne = true;
        return true;
      }
    });
    this.setState({
      loaded: true,
      disclaimer: data.disclaimer,
      description: data.description,
      allow_user_request: data.allow_user_request,
      allowed_domains: data.allowed_domains,
      avatar: data.avatar,
      identifier: data.identifier,
      website: data.website && data.website.title ? data.website.title : '',
      is_member: data.is_member,
      is_op: data.is_op,
      is_owner: data.is_owner,
      new_domain: null,
      atLeastOne: atLeastOne
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
    if (!this.state.is_op && !this.state.is_owner && !this.isAdmin) {
      return  null;
    }

    return (
      <View>
        <Text style={styles.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('GroupAccess', this.props.model)}
          text={i18next.t('GroupSettings:access-title')}
          icon='users'
          type='button'
          action
          first
        />
      </View>
    );
  }
  onGroupEdit (component, value) {
    navigation.navigate('UserField', {
      component,
      value,
      onSave: (key, val, cb) => this.saveGroupData(key, val, cb)
    });
  }
  saveGroupData (key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    app.client.groupUpdate(this.props.model.get('id'), updateData, (response) => {
      if (response.err) {
        for (var k in response.err) {
          Alert.show(i18next.t('messages.' + response.err[k]));
        }
        if (callback) {
          return callback(response.err);
        }
        return;
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
        <ListItem text={i18next.t('GroupSettings:description')}
                  type='edit-button'
                  action
                  value={this.state.description}
                  onPress={() => this.onGroupEdit(require('./GroupEditDescription'), this.state.description)}
        />
        <ListItem text={i18next.t('GroupSettings:website')}
                  type='edit-button'
                  action
                  value={this.state.website}
                  onPress={() => this.onGroupEdit(require('./GroupEditWebsite'), this.state.website)}
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
    var leaveGroupLink = null;
    if (!this.state.atLeastOne) {
      leaveGroupLink = (
        <ListItem
          onPress={() => this.leaveGroup()}
          text={i18next.t('GroupSettings:leave')}
          type='button'
          first
          warning
          title={i18next.t('GroupSettings:end')}
        />
      );
    }
    return (
      <View style={s.listGroup}>
        {leaveGroupLink}
        {deleteGroupLink}
      </View>
    );
  }
  _pickImage () {
    var that = this;
    imageUploader.getImageAndUpload('group,avatar', null, (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveGroupData('avatar', response, () => {
        that.setState({avatar: 'https://res.cloudinary.com/roomly/image/upload/h_30,w_30/' + response.path});
      });
    });
  }

  deleteGroup () {
    Alert.askConfirmation(
      i18next.t('GroupSettings:deleteTitle'),
      i18next.t('GroupSettings:deleteDisclaimer', {identifier: this.props.model.get('identifier')}),
      () => app.client.groupDelete(this.props.model.get('id'), () => {}),
      () => {}
    );
  }
  leaveGroup() {
    app.client.groupLeave(this.props.model.get('id'));
    var model = app.groups.get(this.props.model.get('id'));
    if (!model) {
      return;
    }
    app.groups.remove(model);
    app.trigger('redrawNavigationGroups');
    app.trigger('discussionRemoved', model);
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
  }
});

module.exports = GroupSettings;

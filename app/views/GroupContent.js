'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image
  } = React;

var _ = require('underscore');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var ListItem = require('../components/ListItem');
var alert = require('../libs/alert');
var Button = require('../components/Button');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupContent', {
  'rooms': 'DISCUSSION LIST',
  'users': 'MEMBER LIST',
  'community-member': 'You are a member of this community',
  'community-not-member-title': 'You are not a member yet !',
  'community-not-member': 'You can only see public discussions. Members have special priviledges such as direct access to certain private discussions and to this community members.',
  'community-owner': 'You are the owner of this community',
  'community-op': 'You are an op of this community',
  'invite': 'Manage invitations',
  'create-donut': 'Create a discussion',
  'message-ban': 'You were banned from this community',
  'created': 'created on',
  'leave': 'LEAVE THIS COMMUNTIY',
  'unknownerror': 'Unknown error, please retry later',
  'about': 'ABOUT'
});

var GroupContentView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    data: React.PropTypes.object
  },
  getInitialState: function () {
    return {};
  },
  render: function () {
    return (
      <View style={{ marginBottom: 20 }} >
        {this._renderMessage()}
        {this._renderDiscussionList()}
        {this._renderMemberList()}
        {this._renderAbout()}
        {this._renderLeaveCommunityButton()}
      </View>
    );
  },
  _renderDiscussionList: function () {
    if (this.props.data.i_am_banned) {
      return null;
    }

    let createButton = (
      <ListItem
        type='button'
        last
        first
        action
        onPress={() => navigation.navigate('CreateRoom', {group_id: this.props.data.group_id, group_identifier: this.props.data.identifier})}
        text={i18next.t('GroupContent:create-donut')}
        />
    );
    if (!this.props.data.is_member) {
      createButton = null;
    }

    return (
      <View>
        <Text style={{ marginTop: 20 }}/>
        <ListItem
          onPress={() => navigation.navigate('GroupRooms', this.props.data)}
          text={i18next.t('GroupContent:rooms')}
          type='image-list'
          action
          value={this.props.data.rooms.length + ''}
          first
          imageList={this.props.data.rooms}
          />
        {createButton}
      </View>
    );
  },
  _renderMemberList: function () {
    if (this.props.data.i_am_banned || !this.props.data.is_member) {
      return null;
    }

    let buttons = null;
    if (this.props.data.is_owner || this.props.data.is_op) {
      buttons = (
        <View>
          <ListItem
            type='button'
            first
            last
            action
            onPress={() => navigation.navigate('ManageInvitations', {id: this.props.data.group_id, type: 'group'})}
            text={i18next.t('GroupContent:invite')}
            />
        </View>
      );
    }

    return (
      <View>
        <Text style={{marginTop: 20}}/>
        <ListItem
          onPress={() => navigation.navigate('GroupUsers', this.props.data)}
          text={i18next.t('GroupContent:users')}
          type='image-list'
          action
          value={this.props.data.members.length + ''}
          first
          id={this.props.data.group_id}
          parentType='group'
          isOwnerAdminOrOp={this.props.data.is_owner || this.props.data.is_op || app.user.isAdmin()}
          imageList={this.props.data.members}
          />
        {buttons}
      </View>
    );
  },
  _renderAbout: function () {
    return (
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontWeight: '600', color: '#FC2063', fontFamily: 'Open Sans', fontSize: 16, marginHorizontal: 20, marginVertical: 5 }}>{i18next.t('GroupContent:about')}</Text>
        {this._renderDescription()}
        {this.renderWebsite()}
        {this.renderCreatedAt()}
      </View>
    );
  },
  _renderDescription: function () {
    if (!this.props.data.description) {
      return null;
    }

    let description = _.unescape(this.props.data.description);

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={{ backgroundColor: '#E7ECF3', height: 1, alignSelf: 'stretch' }} />
        <Text style={{ marginVertical: 10, marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{description}</Text>
      </View>
    );
  },
  _renderMessage: function () {
    // render banned
    if (this.props.data.i_am_banned) {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
          <View style={{ backgroundColor: '#F15261', padding: 20, alignSelf: 'stretch' }}>
            <Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#FFFFFF' }}>
              {i18next.t('GroupContent:message-ban')}
            </Text>
          </View>
        </View>
      );
      // render not member
    } else if (!this.props.data.is_member) {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
          <Image source={require('../assets/arrow-top-gray.png')}
                 style={{ width: 30, height: 8.5, resizeMode: 'contain', marginTop: -8.5 }}/>
          <View style={{ backgroundColor: '#E7ECF3', padding: 20, alignSelf: 'stretch' }}>
            <Text
              style={{ fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('GroupContent:community-not-member-title')}</Text>
            <Text
              style={{ marginTop: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('GroupContent:community-not-member')}</Text>
          </View>
        </View>
      );
      // render owner
    } else if (this.props.data.is_owner) {
      return (
        <View
          style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#E7ECF3', padding: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch' }}>
            <Image source={require('../assets/icon-check.png')}
                   style={{ width: 21.5, height: 17.5, resizeMode: 'contain' }}/>
            <Text
              style={{ marginLeft: 10, fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('GroupContent:community-owner')}</Text>
          </View>
        </View>
      );
      // render op
    } else if (this.props.data.is_op) {
      return (
        <View
          style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#E7ECF3', padding: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch' }}>
            <Image source={require('../assets/icon-check.png')}
                   style={{ width: 21.5, height: 17.5, resizeMode: 'contain' }}/>
            <Text
              style={{ marginLeft: 10, fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('GroupContent:community-op')}</Text>
          </View>
        </View>
      );
      // render member
    } else {
      return (
        <View
          style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#E7ECF3', padding: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch' }}>
            <Image source={require('../assets/icon-check.png')}
                   style={{ width: 21.5, height: 17.5, resizeMode: 'contain' }}/>
            <Text
              style={{ marginLeft: 10, fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('GroupContent:community-member')}</Text>
          </View>
        </View>
      );
    }
  },
  renderWebsite: function () {
    if (this.props.data.website) {
      return (
        <ListItem onPress={() => hyperlink.open(this.props.data.website.href)}
                  text={this.props.data.website.title}
                  first
                  action
                  type='button'
                  imageLeft={require('../assets/icon-link.png')}
          />
      );
    }
  },
  renderCreatedAt: function () {
    return (
      <ListItem
        type='text'
        text={i18next.t('GroupContent:created') + ' ' + date.shortDate(this.props.data.created)}
        last
        imageLeft={require('../assets/icon-time.png')}
        />
    );
  },
  _renderLeaveCommunityButton: function () {
    if (!this.props.data.is_member || this.props.data.is_owner) {
      return null;
    }

    return (
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <Button
          onPress={() => alert.askConfirmation('Quit group', 'You will leave this community', () => this.onGroupQuit(), () => {})}
          label={i18next.t('GroupContent:leave')}
          first={!(this.props.data.is_op || app.user.isAdmin())}
          type='gray'
          />
      </View>
    );
  },
  onGroupQuit: function () {
    if (this.props.data.is_member) {
      app.client.groupQuitMembership(this.props.data.group_id, function (response) {
        if (response.err) {
          return alert.show(i18next.t('GroupContent:unknownerror'));
        }
        app.trigger('refreshGroup');
      });
    }
  }
});

module.exports = GroupContentView;

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var alert = require('../libs/alert');
var Card = require('../components/Card');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupContent', {
  'rooms': 'Discussion list',
  'users': 'Member list',
  'community-member': 'You are a member of this community',
  'community-not-member': 'You are not yet a member of this community. You can join public donuts or request access to a private donut. Members have special privileges such as direct access to certain private donuts and to other members of this community.Before you request membership, have a glance at this community access conditions',
  'community-owner': 'You are the owner of this community',
  'community-op': 'You are an op of this community',
  'invite': 'Invite members',
  'manage': 'Manage members',
  "create-donut": "Create a donut",
  "message-ban": "You were banned from this community",
  "request-membership": "request membership",
  "created": "created on",
  "leave": "leave this communtiy",
  "unknownerror": "Unknown error, please retry later"
});

class GroupContentView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      members_count: (props.data.members && props.data.members.length) ? props.data.members.length : 0,
      data: props.data
    };

    this.state.user = {
      isMember: this.isCurrentUserIsMember(),
      isOwner: currentUser.get('user_id') === props.data.owner_id,
      isAdmin: app.user.isAdmin(),
      isOp: this.isCurrentUserIsOP(),
      isBanned: props.data.i_am_banned
    };
  }

  render () {
    return (
      <View>

        <View style={{flex:1}}>
          {this._renderMessage()}
        </View>

        {this._renderDescription()}

        {this._renderAction()}

        {this._renderDiscussionList()}

        {this._renderMemberList()}

        {this._renderLeaveCommunityButton()}

        <Text style={s.listGroupItemSpacing}/>
        {this.renderWebsite()}
        {this.renderCreatedAt()}

      </View>
    );
  }

  _renderDiscussionList() {
    if (this.state.user.isBanned) {
      return null;
    }

    let createButton = (
      <ListItem
        type='button'
        first
        action
        onPress={() => navigation.navigate('CreateRoom', {group_id: this.state.data.group_id, group_identifier: this.state.data.identifier})}
        text={i18next.t('GroupContent:create-donut')}
      />
    );
    if (!this.state.user.isMember) {
      createButton = null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('GroupRooms', {id: this.state.data.group_id, name: this.state.data.identifier, user: this.state.user})}
          text={i18next.t('GroupContent:rooms')}
          icon='bars'
          type='image-list'
          action
          value={this.state.data.rooms.length + ''}
          first
          imageList={this.state.data.rooms}
        />
        {createButton}
      </View>
    );
  }

  _renderMemberList() {
    if (this.state.user.isBanned || !this.state.user.isMember) {
      return null;
    }

    let buttons = null;
    if (this.state.user.isOwner || this.state.user.isOp) {
      buttons = (
        <View>
          <ListItem
            type='button'
            first
            action
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('GroupContent:invite')}
          />
          <ListItem
            type='button'
            action
            last
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('GroupContent:manage')}
          />
        </View>
      );
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('GroupUsers', this.state.data)}
          text={i18next.t('GroupContent:users')}
          icon='users'
          type='image-list'
          action
          value={this.state.data.members.length + ''}
          first
          imageList={this.state.data.members}
        />
        {buttons}
      </View>
    );
  }

  _renderDescription () {
    if (!this.state.data.description) {
      return null;
    }

    let description = _.unescape(this.state.data.description);

    return (
      <Text style={[s.p, s.block]}>{description}</Text>
    );
  }

  _renderMessage () {
    // render banned
    if (this.state.user.isBanned) {
      return (
        <View style={[s.alertError, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertErrorText}>{i18next.t('GroupContent:message-ban')}</Text>
        </View>
      );
      // render not member
    } else if (!this.state.user.isMember) {
      return (
        <View style={[s.alertWarning, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertWarning}>{i18next.t('GroupContent:community-not-member')}</Text>
          {this._renderDisclaimer()}
        </View>
      );
      // render owner
    } else if (this.state.user.isOwner) {
      return (
        <View style={[s.alertSuccess, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertSuccessText}>{i18next.t('GroupContent:community-owner')}</Text>
        </View>
      );
      // render op
    } else if (this.state.user.isOp) {
      return (
        <View style={[s.alertSuccess, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertSuccessText}>{i18next.t('GroupContent:community-op')}</Text>
        </View>
      );
      // render member
    } else {
      return (
        <View style={[s.alertSuccess, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertSuccessText}>{i18next.t('GroupContent:community-member')}</Text>
        </View>
      );
    }
  }

  _renderDisclaimer() {
    if (!this.state.data.disclaimer) {
      return null;
    }

    let disclaimer = _.unescape(this.state.data.disclaimer);
    return (
      <View style={{marginTop: 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
        <Icon
          name='quote-right'
          size={14}
          color='#8a6d3b'
          style={{marginTop: 2}}
        />
        <View style={{flexDirection: 'column', flex:1, justifyContent: 'center'}}>
          <Text style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}>{disclaimer}</Text>
        </View>
      </View>
    );
  }

  _renderAction () {

    if (this.state.user.isMember || this.state.user.isOp || this.state.user.isBanned || this.state.user.isOwner) {
      return null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          type='button'
          first
          action
          onPress={() => navigation.navigate('GroupAsk', this.state.data)}
          text={i18next.t('GroupContent:request-membership')}
          last
          />
      </View>
    );
  }

  renderWebsite () {
    if (this.state.data.website) {
      return (
        <ListItem onPress={() => hyperlink.open(this.state.data.website.href)}
                  text={this.state.data.website.title}
                  first
                  action
                  type='button'
                  icon='link'
          />
      );
    }
  }

  renderCreatedAt () {
    return (
      <ListItem
        type='text'
        text={i18next.t('GroupContent:created') + ' ' + date.shortDate(this.state.data.created)}
        last
        icon='clock-o'
        />
    );
  }

  _renderLeaveCommunityButton () {
    if (!this.state.user.isMember || this.state.user.isOwner) {
      return null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => alert.askConfirmation('Quit group', 'You will leave this community', () => this.onGroupQuit(), () => {})}
          text={i18next.t('GroupContent:leave')}
          first={!(this.isOp || this.isAdmin)}
          action
          warning
          type='button'
          iconColor='#e74c3c'
        />
      </View>
    );
  }

  onGroupQuit () {
    if (this.state.user.isMember) {
      app.client.groupQuitMembership(this.state.data.group_id, function (response) {
        if (response.err) {
          return alert.show(i18next.t('GroupContent:unknownerror'));
        }
        app.trigger('refreshGroup');
      });
    }
  }

  isCurrentUserIsMember () {
    return !!_.find(this.state.data.members, function (member) {
      if (currentUser.get('user_id') === member.user_id) {
        return true; // found
      }
    });
  }

  isCurrentUserIsOP () {
    if (!this.state.members_count) {
      return false;
    }
    return !!_.find(this.state.data.members, function (item) {
      return (item.user_id === currentUser.get('user_id') && item.is_op === true);
    });
  }
}

module.exports = GroupContentView;

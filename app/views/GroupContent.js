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
  'community-not-member': 'You are not a member yet ! You can only see public discussions. Members have special priviledges such as direct access to certain private discussions and to this community members.',
  'community-owner': 'You are the owner of this community',
  'community-op': 'You are an op of this community',
  'invite': 'Invite members',
  'manage': 'Manage members',
  "create-donut": "Create a discussion",
  "message-ban": "You were banned from this community",
  "request-membership": "request membership",
  "created": "created on",
  "leave": "leave this communtiy",
  "unknownerror": "Unknown error, please retry later"
});

class GroupContentView extends Component {
  constructor (props) {
    super(props);
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
    if (this.props.data.i_am_banned) {
      return null;
    }

    let createButton = (
      <ListItem
        type='button'
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
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('GroupRooms', this.props.data)}
          text={i18next.t('GroupContent:rooms')}
          icon='bars'
          type='image-list'
          action
          value={this.props.data.rooms.length + ''}
          first
          imageList={this.props.data.rooms}
        />
        {createButton}
      </View>
    );
  }

  _renderMemberList() {
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
          onPress={() => navigation.navigate('GroupUsers', this.props.data)}
          text={i18next.t('GroupContent:users')}
          icon='users'
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
  }

  _renderDescription () {
    if (!this.props.data.description) {
      return null;
    }

    let description = _.unescape(this.props.data.description);

    return (
      <Text style={[s.p, s.block]}>{description}</Text>
    );
  }

  _renderMessage () {
    // render banned
    if (this.props.data.i_am_banned) {
      return (
        <View style={[s.alertError, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertErrorText}>{i18next.t('GroupContent:message-ban')}</Text>
        </View>
      );
      // render not member
    } else if (!this.props.data.is_member) {
      return (
        <View style={[s.alertWarning, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertWarning}>{i18next.t('GroupContent:community-not-member')}</Text>
          {this._renderDisclaimer()}
        </View>
      );
      // render owner
    } else if (this.props.data.is_owner) {
      return (
        <View style={[s.alertSuccess, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertSuccessText}>{i18next.t('GroupContent:community-owner')}</Text>
        </View>
      );
      // render op
    } else if (this.props.data.is_op) {
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
    if (!this.props.data.disclaimer) {
      return null;
    }

    let disclaimer = _.unescape(this.props.data.disclaimer);
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

    if (this.props.data.is_member || this.props.data.is_op || this.props.data.i_am_banned || this.props.data.is_owner) {
      return null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          type='button'
          first
          action
          onPress={() => navigation.navigate('GroupAsk', this.props.data)}
          text={i18next.t('GroupContent:request-membership')}
          last
          />
      </View>
    );
  }

  renderWebsite () {
    if (this.props.data.website) {
      return (
        <ListItem onPress={() => hyperlink.open(this.props.data.website.href)}
                  text={this.props.data.website.title}
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
        text={i18next.t('GroupContent:created') + ' ' + date.shortDate(this.props.data.created)}
        last
        icon='clock-o'
        />
    );
  }

  _renderLeaveCommunityButton () {
    if (!this.props.data.is_member || this.props.data.is_owner) {
      return null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => alert.askConfirmation('Quit group', 'You will leave this community', () => this.onGroupQuit(), () => {})}
          text={i18next.t('GroupContent:leave')}
          first={!(this.props.data.is_op || app.user.isAdmin())}
          action
          warning
          type='button'
          iconColor='#e74c3c'
        />
      </View>
    );
  }

  onGroupQuit () {
    if (this.props.data.is_member) {
      app.client.groupQuitMembership(this.props.data.group_id, function (response) {
        if (response.err) {
          return alert.show(i18next.t('GroupContent:unknownerror'));
        }
        app.trigger('refreshGroup');
      });
    }
  }

  isCurrentUserIsMember () {
    return !!_.find(this.props.data.members, function (member) {
      if (currentUser.get('user_id') === member.user_id) {
        return true; // found
      }
    });
  }

  isCurrentUserIsOP () {
    if (!this.props.data.members) {
      return false;
    }
    return !!_.find(this.props.data.members, function (item) {
      return (item.user_id === currentUser.get('user_id') && item.is_op === true);
    });
  }
}

module.exports = GroupContentView;

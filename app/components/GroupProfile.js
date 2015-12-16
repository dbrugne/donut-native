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


var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/mobile-current-user');
var navigation = require('../libs/navigation');
var s = require('../styles/style');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var Link = require('../elements/Link');
var Button = require('../elements/Button');
var ListItem = require('../elements/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'created': 'created on',
  'edit': 'edit',
  'access': 'access',
  'user-list': 'user list',
  'allowed-users': 'allowed users',
  'leave': 'leave this communtiy',
  'by': 'by',
  'join': 'join',
  'request-membership': 'request membership',
  'create-donut': 'create a donut',
  'manage-members': 'manage memebers',
  'donut-list': 'donut list',
  'message-membership': 'You are not yet a member of this community You can join public donuts or request access to a private donut. Members have special priviledges such as direct access to certain private donuts and to other members of this community.Before you request membership have a glance at this community access conditions :',
  'message-member': 'You are a member of this community',
  'message-ban': 'You were banned from this community'
});

class GroupProfileView extends Component {
  constructor(props) {
    super(props);
    this.members_count = (props.data.members && props.data.members.length) ? props.data.members.length : 0;

    this.isMember = this.isCurrentUserIsMember();
    this.isOwner = currentUser.get('user_id') === props.data.owner_id;
    this.isAdmin = currentUser.isAdmin();
    this.isOp = this.isCurrentUserIsOP();
    this.isBanned = this.isCurrentUserIsBan();
  }

  render() {
    var avatarUrl = common.cloudinary.prepare(this.props.data.avatar, 120);
    var description = _.unescape(this.props.data.description);

    // render

    // @todo implement joinGroup @spariaud
    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image style={styles.avatar} source={{uri: avatarUrl}}/>
            <View style={styles.headerRight}>
              <Text style={styles.identifier}>{this.props.data.identifier}</Text>
              <Link onPress={() => { navigation.switchTo(navigation.getProfile({type: 'user', id: this.props.data.owner_id, identifier: '@' + this.props.data.owner_username})) }}
                    prepend={i18next.t('local:by')}
                    text={'@' + this.props.data.owner_username}
                    type='bold'
                />
            </View>
          </View>
          <Text style={styles.description}>{description}</Text>
          {this.renderMessage()}
        </View>
        <View style={styles.container2}>
          {this.renderAction()}
          <View style={[s.listGroup, {marginTop: 20}]}>
            {this.renderLinks()}
            {this.renderWebsite()}
            {this.renderCreatedAt()}
          </View>
        </View>
      </ScrollView>
    );
  }

  renderMessage () {
    if ((this.isMember || this.isOwner || this.isAdmin) && !this.isBanned) {
      return (
        <View style={s.alertSuccess}>
          <Text style={s.alertSuccessText}>{i18next.t('local:message-member')}</Text>
        </View>
      );
    }
    if (!this.isMember && !this.isBanned && !this.isOwner && !this.isAdmin) {
      return (
        <View style={s.alertWarning}>
          <Text style={s.alertWarningText}>{i18next.t('local:message-membership')}</Text>
        </View>
      );
    }
    if (this.isBanned) {
      return (
        <View style={s.alertError}>
          <Text style={s.alertErrorText}>{i18next.t('local:message-ban')}</Text>
        </View>
      );
    }
    return null;
  }
  renderAction () {
    var donutList = null;

    if ((this.isMember || this.isOwner || this.isAdmin) && !this.isBanned) {
      return (
        <View>
          <Button
            type='blue'
            label={i18next.t('local:create-donut')} />
          <Button
            type='blue'
            label={i18next.t('local:donut-list')} />
        </View>
      );
    }
    if (!this.isMember && !this.isOp && !this.isBanned && !this.isOwner && !this.isAdmin) {
      return (
        <View>
          <Button onPress={() => this.props.navigator.push(navigation.getGroupAskMembership(this.props.data.group_id))}
                  type='blue'
                  label={i18next.t('local:request-membership')} />
          <Button
            type='blue'
            label={i18next.t('local:donut-list')} />
        </View>
      );
    }
    return null;
  }
  renderWebsite () {
    if (this.props.data.website) {
      return (
        <ListItem onPress={() => hyperlink.open(this.props.data.website.href)}
            text={this.props.data.website.title}
            first={false}
            action='true'
            type='button'
            icon='fontawesome|link'
          />
      );
    }
  }
  renderCreatedAt () {
    var text = i18next.t('local:created') + ' ' + date.longDateTime(this.props.data.created);
    return (
      <ListItem
        text={text}
        last={true}
        action='false'
        icon='fontawesome|clock-o'
        />
    );
  }
  renderLinks () {
    var list = null;
    if (this.isOwner || this.isAdmin || this.isOp) {
      // @todo implement onpress goto group edit
      // @todo implement onpress goto group access
      // @todo implement onpress goto group users-list
      // @todo implement onpress goto group user-allowed
      // @todo implement onpress goto group exit
      list = (
        <View>
          <ListItem
              text={i18next.t('local:edit')}
              first={true}
              action='true'
              type='button'
              icon='fontawesome|pencil'
            />
          <ListItem
              text={i18next.t('local:access')}
              action='true'
              type='button'
              icon='fontawesome|key'
            />
          <ListItem
              text={i18next.t('local:user-list')}
              action='true'
              type='button'
              icon='fontawesome|users'
            />
          <ListItem
              text={i18next.t('local:allowed-users')}
              action='true'
              type='button'
              icon='fontawesome|check-circle'
            />
        </View>
      );
    }
    var quit = null;
    if (!this.isOwner && this.isMember) {
      quit = (
        <ListItem
            text={i18next.t('local:leave')}
            first={!(this.isOp || this.isAdmin)}
            action='true'
            type='button'
            icon='fontawesome|close'
          />
      );
    }
    return (
      <View>
        {list}
        {quit}
      </View>
    );
  }

  isCurrentUserIsMember () {
    return !!_.find(this.props.data.members, function (member) {
      if (currentUser.get('user_id') === member.user_id) {
        return true; // found
      }
    });
  }
  isCurrentUserIsOP () {
    if (!this.members_count) {
      return false;
    }
    return !!_.find(this.props.data.members, function (item) {
      return (item.user_id === currentUser.get('user_id') && item.is_op === true);
    });
  }
  isCurrentUserIsBan () {
    return !!(this.props.data.bans && _.find(this.props.data.bans, function (bannedUser) {
      return bannedUser.user_id === currentUser.get('user_id');
    }));
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
    borderColor: '#DDD'
  },
  headerContainer: {
    flexDirection: 'row'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
    borderColor: '#DCDCDC',
    borderWidth: 2
  },
  headerRight: {
    flexDirection: 'column',
    marginLeft: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  },
  ownerUsername: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  description: {
    marginVertical: 10,
    marginHorizontal: 10,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 16
  },
  icon: {
    width: 14,
    height: 14
  }
});

module.exports = GroupProfileView;

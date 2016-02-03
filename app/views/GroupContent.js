'use strict';

var React = require('react-native');
var {
  StyleSheet,
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
  'rooms': 'Discussion list'
});

class GroupProfileView extends Component {
  constructor (props) {
    super(props);
    this.members_count = (props.data.members && props.data.members.length) ? props.data.members.length : 0;
    this.state = {
      user: {
        isMember: this.isCurrentUserIsMember(),
        isOwner: currentUser.get('user_id') === props.data.owner_id,
        isAdmin: app.user.isAdmin(),
        isOp: this.isCurrentUserIsOP(),
        isBanned: props.data.i_am_banned
      },
      rooms: props.data.rooms
    };
  }

  render () {
    return (
      <View>
        {this._renderDescription()}

        <View style={{flex:1}}>
          {this.renderMessage()}
        </View>

        <Text style={styles.listGroupItemSpacing}/>
        {this.renderAction()}

        <Text style={styles.listGroupItemSpacing}/>
        {this.renderLinks()}

        <Text style={styles.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('GroupRooms', {id: this.props.data.group_id, name: this.props.data.identifier, user: this.state.user})}
          text={i18next.t('GroupContent:rooms')}
          icon='bars'
          type='image-list'
          action
          value={this.state.rooms.length + ''}
          first
          imageList={this.state.rooms}
        />

        <Text style={styles.listGroupItemSpacing}/>
        {this.renderWebsite()}
        {this.renderCreatedAt()}

      </View>
    );
  }

  _renderDescription () {
    if (!this.props.data.description) {
      return null;
    }

    let description = _.unescape(this.props.data.description);

    return (
      <Text style={styles.description}>{description}</Text>
    );
  }

  renderMessage () {
    if ((this.state.user.isMember || this.state.user.isOwner) && !this.state.user.isBanned) {
      return (
        <View style={[s.alertSuccess, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertSuccessText}>{i18next.t('group.message-member')}</Text>
        </View>
      );
    }
    if (!this.state.user.isMember && !this.state.user.isBanned && !this.state.user.isOwner) {
      return (
        <View style={[s.alertWarning, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertWarningText}>{i18next.t('group.message-membership')}</Text>
          {this._renderDisclaimer()}
        </View>
      );
    }
    if (this.state.user.isBanned) {
      return (
        <View style={[s.alertError, {marginLeft: 0, marginRight: 0, marginBottom: 0}]}>
          <Text style={s.alertErrorText}>{i18next.t('group.message-ban')}</Text>
        </View>
      );
    }
    return null;
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

  renderAction () {
    var opActions = null;
    if ((this.state.user.isOwner || this.state.user.isAdmin || this.state.user.isOp) && !this.state.user.isBanned) {
      opActions = (
        <View>
          <ListItem
            type='button'
            action
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('group.edit')}
            />
          <ListItem
            type='button'
            action
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('group.access')}
            />
          <ListItem
            type='button'
            last
            action
            onPress={() => navigation.navigate('AvailableSoon')}
            text={i18next.t('group.allowed-users')}
            />
        </View>
      );
    }
    if ((this.state.user.isMember || this.state.user.isOwner) && !this.state.user.isBanned) {
      return (
        <View>
          <ListItem
            type='button'
            first
            action
            onPress={() => navigation.navigate('CreateRoom', {group_id: this.props.data.group_id, group_identifier: this.props.data.identifier})}
            text={i18next.t('group.create-donut')}
            />
          <ListItem
            type='button'
            last
            action
            onPress={() => navigation.navigate('GroupUsers', this.props.data)}
            text={i18next.t('group.group-users')}
            />
          {opActions}
        </View>
      );
    }
    if (!this.state.user.isMember && !this.state.user.isOp && !this.state.user.isBanned && !this.state.user.isOwner) {
      return (
        <View>
          <ListItem
            type='button'
            first
            action
            onPress={() => navigation.navigate('GroupAsk', this.props.data.group_id)}
            text={i18next.t('group.request-membership')}
            last
            />
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
        text={i18next.t('group.created') + ' ' + date.shortDate(this.props.data.created)}
        last
        icon='clock-o'
        />
    );
  }

  renderLinks () {
    var quit = null;
    if (!this.state.user.isOwner && this.state.user.isMember) {
      quit = (
        <ListItem
          onPress={() => alert.askConfirmation('Quit group', 'You will leave this community', () => this.onGroupQuit(), () => {})}
          text={i18next.t('group.leave')}
          first={!(this.isOp || this.isAdmin)}
          action
          warning
          type='button'
          iconColor='#e74c3c'
          />
      );
    }

    return (
      <View>
        {quit}
      </View>
    );
  }

  onGroupQuit () {
    if (this.state.user.isMember) {
      app.client.groupQuitMembership(this.props.data.group_id, function (response) {
        if (response.err) {
          return alert.show(i18next.t('group.unknownerror'));
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
    if (!this.members_count) {
      return false;
    }
    return !!_.find(this.props.data.members, function (item) {
      return (item.user_id === currentUser.get('user_id') && item.is_op === true);
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10
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

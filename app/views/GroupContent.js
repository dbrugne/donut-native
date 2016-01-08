'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  Image,
  ScrollView
} = React;
var {
  Icon
} = require('react-native-icons');

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

var i18next = require('../libs/i18next');

class GroupProfileView extends Component {
  constructor (props) {
    super(props);

    this.members_count = (props.data.members && props.data.members.length) ? props.data.members.length : 0,

    this.state = {
      user: {
        isMember: this.isCurrentUserIsMember(),
        isOwner: currentUser.get('user_id') === props.data.owner_id,
        isAdmin: app.user.isAdmin(),
        isOp: this.isCurrentUserIsOP(),
        isBanned: props.data.i_am_banned
      }
    };
  }

  render () {
    // render
    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          {this._renderAvatar()}
          <Text style={styles.identifier}>{this.props.data.identifier}</Text>
          <Link
            onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.data.owner_id, identifier: '@' + this.props.data.owner_username})}
            prepend={i18next.t('by')}
            text={'@' + this.props.data.owner_username}
            type='bold'
            />
          {this._renderDescription()}
        </View>

        <View style={{flex:1}}>
          {this.renderMessage()}
        </View>

        <Text style={styles.listGroupItemSpacing}/>
        {this.renderAction()}

        <Text style={styles.listGroupItemSpacing}/>
        {this.renderWebsite()}
        {this.renderCreatedAt()}

        <Text style={styles.listGroupItemSpacing}/>
        {this.renderLinks()}

      </ScrollView>
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

  _renderAvatar () {
    if (!this.props.data.avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(this.props.data.avatar, 130);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
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
          name='fontawesome|quote-right'
          size={14}
          color='#8a6d3b'
          style={{width: 14, height: 14, marginTop: 2}}
          />
        <View style={{flexDirection: 'column', flex:1, justifyContent: 'center'}}>
          <Text style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}>{disclaimer}</Text>
        </View>
      </View>
    );
  }

  renderAction () {
    // @todo implement onPress goto create donut
    if ((this.state.user.isMember || this.state.user.isOwner) && !this.state.user.isBanned) {
      return (
        <View>
          <ListItem
            type='button'
            first
            action
            onPress={() => console.log('@todo implement create donut')}
            text={i18next.t('group.create-donut') + ' TODO'}
            />
          <ListItem
            type='button'
            last
            action
            onPress={() => navigation.navigate('GroupRooms', {id: this.props.data.group_id, name: this.props.data.identifier, user: this.state.user})}
            text={i18next.t('group.donut-list')}
            />
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
            />
          <ListItem
            type='button'
            last
            action
            onPress={() => navigation.navigate('GroupRooms', {id: this.props.data.group_id, name: this.props.data.identifier, user: this.state.user})}
            text={i18next.t('group.donut-list')}
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
                  first={false}
                  action='true'
                  type='button'
                  icon='fontawesome|link'
          />
      );
    }
  }

  renderCreatedAt () {
    return (
      <ListItem
        text={i18next.t('group.created') + ' ' + date.shortDate(this.props.data.created)}
        last
        icon='fontawesome|clock-o'
        />
    );
  }

  renderLinks () {
    // var list = null;
    // if (this.state.user.isOwner || this.state.user.isAdmin || this.state.user.isOp) {
    //   // @todo implement onpress goto group edit
    //   // @todo implement onpress goto group users
    //   // @todo implement onpress goto group access
    //   // @todo implement onpress goto group users-list
    //   // @todo implement onpress goto group user-allowed
    //   // @todo implement onpress goto group exit
    //   list = (
    //     <View>
    //       <ListItem onPress={() => console.log('@todo implement group edit')}
    //                 text={i18next.t('group.edit') + ' TODO'}
    //                 first={true}
    //                 action='true'
    //                 type='button'
    //                 icon='fontawesome|pencil'
    //         />
    //       <ListItem onPress={() => console.log('@todo implement group access')}
    //                 text={i18next.t('group.access') + ' TODO'}
    //                 action='true'
    //                 type='button'
    //                 icon='fontawesome|key'
    //         />
    //       <ListItem onPress={() => console.log('@todo implement group user-list')}
    //                 text={i18next.t('group.user-list') + ' TODO'}
    //                 action='true'
    //                 type='button'
    //                 icon='fontawesome|users'
    //         />
    //       <ListItem onPress={() => console.log('@todo implement group allowed-users')}
    //                 text={i18next.t('group.allowed-users') + ' TODO'}
    //                 action='true'
    //                 type='button'
    //                 icon='fontawesome|check-circle'
    //         />
    //     </View>
    //   );
    // }
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
      app.client.groupLeave(this.props.data.group_id, function (response) {
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
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
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

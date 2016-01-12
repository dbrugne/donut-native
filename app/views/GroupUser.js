'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image
  } = React;

var app = require('../libs/app');
var common = require('@dbrugne/donut-common/mobile');
var ListItem = require('../components/ListItem');
var s = require('../styles/style');
var alert = require('../libs/alert');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'groupUser', {
  'op': 'Make moderator',
  'modal-description-op': 'Are you sure you want to make @__username__ moderator?',
  'deop': 'Remove from moderator',
  'modal-description-deop': 'Are you sure you want to remove @__username__ from moderators?',
  'ban': 'Kick and ban',
  'modal-description-ban': 'Are you sure you want to ban @__username__?',
  'deban': 'unban',
  'modal-description-deban': 'Are you sure you want to unban @__username__?'
});

var GroupUserView = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    groupId: React.PropTypes.string,
    fetchParent: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      isOp: this.props.user.is_op,
      isOwner: this.props.user.is_owner
    };
  },

  render: function () {
    var avatarUrl = common.cloudinary.prepare(this.props.user.avatar, 120);
    var role = null;
    if (this.state.isOp) {
      role = <Text style={[styles.role]}>{i18next.t('op')}</Text>;
    }
    if (this.state.isOwner) {
      role = <Text style={[styles.role]}>{i18next.t('owner')}</Text>;
    }
    return (
      <ScrollView style={styles.main}>
        <View style={[styles.container, {position: 'relative'}]}>
          <Image style={styles.avatar} source={{uri: avatarUrl}} />
          <Text style={[styles.username]}>@{this.props.user.username}</Text>
          {role}
        </View>
        <View style={[s.listGroup]}>
          <Text style={s.listGroupItemSpacing} />
          {this._renderActions()}
          <Text style={s.listGroupItemSpacing} />
        </View>
      </ScrollView>
    );
  },

  _renderActions: function () {
    var actions = [];
    if (this.state.isOwner) {
      return null;
    }
    if (this.state.isOp) {
      actions.push(
        <ListItem
          key='deop'
          text={i18next.t('groupUser:deop')}
          type='edit-button'
          first
          action
          icon='fontawesome|shield'
          onPress={() => this._onDeop()}
          />
      );
    } else {
      actions.push(
        <ListItem
          key='op'
          text={i18next.t('groupUser:op')}
          type='edit-button'
          first
          action
          iconColor='#4fedc0'
          icon='fontawesome|shield'
          onPress={() => this._onOp()}
          />
      );
    }
    if (this.state.isBanned) {
      actions.push(
        <ListItem
          key='unban'
          text={i18next.t('groupUser:unban')}
          type='edit-button'
          action
          icon='fontawesome|ban'
          onPress={() => this._onUnban()}
          />
      );
    } else {
      actions.push(
        <ListItem
          key='ban'
          text={i18next.t('groupUser:ban')}
          type='edit-button'
          actio
          iconColor='#ff3838'
          icon='fontawesome|ban'
          onPress={() => this._onBan()}
          />
      );
    }
    return actions;
  },

  _onDeop: function () {
    alert.askConfirmation(
      i18next.t('groupUser:deop'),
      i18next.t('groupUser:modal-description-deop', {username: this.props.user.username}),
      () => {
        app.client.groupDeop(this.props.groupId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isOp: false});
          this.props.fetchParent();
        });
      },
      () => {}
    );
  },
  _onOp: function () {
    alert.askConfirmation(
      i18next.t('groupUser:op'),
      i18next.t('groupUser:modal-description-op', {username: this.props.user.username}),
      () => {
        app.client.groupOp(this.props.groupId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isOp: true});
          this.props.fetchParent();
        });
      },
      () => {}
    );
  },
  _onUnban: function () {
    alert.askConfirmation(
      i18next.t('groupUser:deban'),
      i18next.t('groupUser:modal-description-deban', {username: this.props.user.username}),
      () => {
        app.client.groupDeban(this.props.groupId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isBanned: false});
          this.props.fetchParent();
        });
      },
      () => {}
    );
  },
  _onBan: function () {
    alert.askConfirmation(
      i18next.t('groupUser:ban'),
      i18next.t('groupUser:modal-description-ban', {username: this.props.user.username}),
      () => {
        app.client.groupBan(this.props.groupId, this.props.user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isBanned: true});
          this.props.fetchParent();
        });
      },
      () => {}
    );
  }
});

var styles = StyleSheet.create({
  main: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  role: {
    marginBottom: 5
  },
  avatar: {
    width: 120,
    height: 120,
    marginTop: 20
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  }
});

module.exports = GroupUserView;

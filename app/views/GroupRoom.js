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
i18next.addResourceBundle('en', 'groupRoom', {
  'delete-room': 'Delete this discussion',
  'modal-description-delete': 'Are you sure you want to delete __identifier__'
});

var GroupRoomView = React.createClass({
  propTypes: {
    room: React.PropTypes.object,
    data: React.PropTypes.object
  },
  getInitialState: function () {
    return { };
  },
  render: function () {
    var avatarUrl = common.cloudinary.prepare(this.props.room.avatar, 120);

    return (
      <ScrollView style={styles.main}>
        <View style={[styles.container, {position: 'relative'}]}>
          <Image style={styles.avatar} source={{uri: avatarUrl}} />
          <Text style={styles.identifier}>{this.props.room.identifier}</Text>
        </View>
        <View style={[s.listGroup]}>
          <Text style={s.listGroupItemSpacing} />
          {this._renderActions()}
          <Text style={s.listGroupItemSpacing} />
        </View>
      </ScrollView>
    );
  },
  /**
   *
   * @returns {*}
   * @private
   *
   * When calling this function, I am admin or group_owner or group_op or owner or op
   */
  _renderActions: function () {
    if (this.props.data.is_op || this.props.data.is_group_op || this.props.room.is_default) {
      return null;
    }

    return (
      <ListItem
        key='delete'
        text={i18next.t('groupRoom:delete-room')}
        type='edit-button'
        first
        last
        action
        warning
        onPress={() => this._onDelete()}
      />
    );
  },
  _onDelete: function () {
    var roomId = this.props.room.id;
    alert.askConfirmation(
      i18next.t('groupRoom:delete-room'),
      i18next.t('groupRoom:modal-description-delete', {identifier: this.props.data.identifier}),
      () => {
        app.client.roomDelete(roomId, (response) => {
          app.trigger('refreshGroup', true);
          this.props.navigator.popToTop();
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

module.exports = GroupRoomView;

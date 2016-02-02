'use strict';

var React = require('react-native');
var {
  PushNotificationIOS
} = React;

var DonutParse = require('NativeModules').DonutParse;
var app = require('../libs/app');
var navigation = require('../navigation/index');
var utils = require('./utils');
var debug = require('./../libs/debug')('pushNotification');
// var i18next = require('../libs/i18next');
// var common = require('@dbrugne/donut-common/mobile');
// var emojione = require('emojione');

var PushNotification = React.createClass({
  componentDidMount () {
    PushNotificationIOS.addEventListener('register', this.onRegister);
//    PushNotificationIOS.addEventListener('notification', this.onParseNotification);

    app.user.on('change:badge', this.onBadgeChange, this);
//    app.user.on('change:unviewedDiscussion', this.onUnviewedNotification, this);
//    app.client.on('notification:new', this.onWsNotification, this);

    this._checkPermissions(); // @debug
    this._requestPermissions();
  },
  componentWillUnmount () {
    PushNotificationIOS.removeEventListener('register', this.onRegister);
//    PushNotificationIOS.removeEventListener('notification', this.onParseNotification);

    app.user.off(null, null, this);
//    app.client.off(null, null, this);
  },
  render () {
    return null;
  },
  onRegister (deviceToken) {
    debug.log('onRegister', deviceToken);
    DonutParse.getParseInstallationObjectId((err, objectId) => {
      if (err) {
        return debug.warn('onRegister', err);
      }
      utils.registerDeviceOnDonut(objectId);
    });
  },
  onBadgeChange (model, value) {
    PushNotificationIOS.setApplicationIconBadgeNumber(value || 0);
  },
  _checkPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('checkPermissions', permissions);
    });
  },
  _requestPermissions () {
    debug.log('requestPermissions');
    PushNotificationIOS.requestPermissions();
  },
  routeNotification (data) {
//    if (!data.data && data.getData) {
//      data.data = data.getData();
//    }
//
//    if (data.data.group) {
//      return navigation.navigate('Group', {
//        id: data.data.group.id,
//        name: data.data.group.name
//      });
//    }
//
//    if (data.data.room) {
//      var model = app.rooms.get(data.data.room.id);
//      if (model) {
//        return navigation.navigate('Discussion', model);
//      } else {
//        return navigation.navigate('Profile', {
//          type: 'room',
//          id: data.data.room.id,
//          identifier: data.data.room.name
//        });
//      }
//    }

    // default
    navigation.navigate('Notifications');
  },
//  onParseNotification (n) {
//    if (n.getAlert() && !n.getData()) {
//      // test notification from parse interface
//      return React.Alert.alert(n.getAlert());
//    }
//
//    // very rare case where we receiving parse push notification while connected
//    debug.log('onParseNotification', n);
//    var data = n.getData();
//    this._handleNotification({
//      title: n.getAlert(),
//      body: data.title,
//      onClick: () => this.routeNotification()
//    });
//  },
//  onUnviewedNotification (value, model) {
//    if (value !== true) {
//      return;
//    }
//    // @todo this._handleNotification
//  },
//  onWsNotification (data) {
//    debug.log('onWsNotification', data);
//
//    var message = (data.data.message)
//      ? common.markup.toText(data.data.message)
//      : '';
//    var topic = (data.data.topic)
//      ? common.markup.toText(data.data.topic)
//      : '';
//    var body = i18next.t('notifications.messages.' + data.type, {
//      name: data.data.name,
//      username: data.data.username,
//      message: (message) ? emojione.shortnameToUnicode(message) : '',
//      topic: (topic) ? emojione.shortnameToUnicode(topic) : ''
//    });
//    this._handleNotification({
//      title: 'New notification: ' + data.type,
//      body: body,
//      onClick: () => this.routeNotification()
//    });
//  },
  handleInitialNotification () {
    var n = PushNotificationIOS.popInitialNotification();
    if (n) {
      debug.log('handleInitialNotification');
      this.routeNotification(n);
    }
  }
//  _handleNotification (data) {
//    debug.log('_handleNotification', data);
//    if (this.props.appState === 'active') {
//      this._handleNotificationForeground(data);
//    } else {
//      this._handleNotificationBackground(data);
//    }
//  },
//  _handleNotificationForeground (data) {
//    // no action when foreground, badge is enough
//  },
//  _handleNotificationBackground (data) {
//    // @need title
//    PushNotificationIOS.presentLocalNotification({
//      alertBody: data.title
//    });
//  }
});

module.exports = PushNotification;

'use strict';

var React = require('react-native');
var {
  PushNotificationIOS
} = React;

var DonutParse = require('react-native').NativeModules.DonutParse;
var utils = require('./utils');
var alert = require('../libs/alert');

var debug = require('./../libs/debug')('pushNotification');

module.exports = {
  componentDidMount () {
    PushNotificationIOS.addEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.addEventListener('notification', this.onNotification.bind(this));

    this.checkPermissions(); // @debug
    this.requestPermissions();
  },
  componentWillUnmount () {
    PushNotificationIOS.removeEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.removeEventListener('notification', this.onNotification.bind(this));
  },
  handleInitialNotification () {
    var n = PushNotificationIOS.popInitialNotification();
    if (n) {
      debug.log('handleInitialNotification');
      this._handleNotification(n);
    }
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
  onNotification (n) {
    debug.log('onNotification');
    this._handleNotification(n);
  },
  _handleNotification (pushNotification) {
    console.log('_handleNotification', pushNotification);

    if (pushNotification.getAlert()) {
      // test notification from parse interface
      return alert.show(pushNotification.getAlert());
    }

    // badge
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
    PushNotificationIOS.getApplicationIconBadgeNumber((n) => {
      PushNotificationIOS.setApplicationIconBadgeNumber(n + 1); // @todo probably not work when app is closed, need to rely on parse managing
    });

    /**
     * {
     *   _data: {
     *     parsePushId: objectId,
     *     title: 'Nouveau message privé de @yangs',
     *     img: 'https://res.cloudinary.com/roomly/image/upload/b_rgb:cc1f2f,c_fill,d_user-avatar-default.png,f_jpg,g_face,h_48,w_48/v1422437207/sz0yn9kyfop1jpkaqs2o.jpg',
     *     type: 'usermessage'
     *    },
     *   _alert: 'grunt Test push notification',
     *   _sound: undefined,
     *   _badgeCount: 17
     * }
     */

    var data = pushNotification.getData();

//    var n = {
//      alert: pushNotification.getAlert(),
//      badge: pushNotification.getBadgeCount(),
//      sound: pushNotification.getSound(),
//      data: pushNotification.getData()
//    };
    debug.log('handleNotification', data);
    alert(data.title);
  },
  checkPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('checkPermissions', permissions);
    });
  },
  requestPermissions () {
    debug.log('requestPermissions');
    PushNotificationIOS.requestPermissions();
  }
};


/**
 * {
 *   title: String, (Android only)
 *   alert: String
 *   badge: String Increment
 *   img: String (Android only)
 * }
 *
 * handleNotification (data) {
 *   debug.log('handleNotification', data);
 *   alert(data.alert);
 * }
 */

/**
 * @doc: http://stackoverflow.com/questions/29408492/is-it-possible-to-combine-react-native-with-socket-io
 */

window.navigator.userAgent = 'react-native';

var debug = require('./debug')('client');
var Client = require('@dbrugne/donut-common/client');
var config = require('./config')();

module.exports = Client({
  device: 'native',
  host: config.ws,
  debug: function () {
    debug.log.apply(debug.log, arguments);
  },
  retrieveToken: (callback) => {
    // @warning: require must be done later due to react-native package cyclic
    // reference on startup
    return callback(null, require('../models/mobile-current-user').getToken());
  },
  invalidToken: (callback) => {
    // try to obtain new token
    currentUser.renewToken(callback);
  },
  sio: {
    transports: ['websocket']
  }
});

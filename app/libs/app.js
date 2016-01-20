// @doc: http://stackoverflow.com/questions/29408492/is-it-possible-to-combine-react-native-with-socket-io
window.navigator.userAgent = 'react-native';

var debug = require('./debug')('client');
var config = require('./config')();

var AppFactory = require('@dbrugne/donut-client');

module.exports = AppFactory({
  device: 'mobile',
  host: config.ws,
  debug: function () {
    debug.log.apply(debug.log, arguments);
  },
  retrieveToken: (callback) => {
    // @warning: require must be done later due to react-native package cyclic
    // reference on startup
    return callback(null, require('../models/current-user').getToken());
  },
  invalidToken: (callback) => {
    // try to obtain new token
    require('../models/current-user').renewToken(callback);
  },
  sio: {
    transports: ['websocket']
  }
});

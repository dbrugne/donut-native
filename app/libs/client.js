/**
 * @doc: http://stackoverflow.com/questions/29408492/is-it-possible-to-combine-react-native-with-socket-io
 */

window.navigator.userAgent = 'react-native';

var React = require('react-native');

var Client = require('@dbrugne/donut-common/client');
var currentUser = require('../models/mobile-current-user');
var storage = require('./storage');

// token retrieving logic
var getTokenFromSession = function (callback) {
  storage.getKey('token', callback); // @todo : fix bug when using currentUser directly (probably lifecycle side effect)
};

module.exports = Client({
  device: 'native',
  host: 'https://test.donut.me',
  debug: () => {
//    console.log(arguments);
  },
  retrieveToken: getTokenFromSession,
  invalidToken: getTokenFromSession,
  sio: {
    transports: ['websocket']
  }
});

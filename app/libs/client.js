/**
 * @doc: http://stackoverflow.com/questions/29408492/is-it-possible-to-combine-react-native-with-socket-io
 */

window.navigator.userAgent = 'react-native';

var React = require('react-native');
var {
  AsyncStorage
} = React;

var Client = require('@dbrugne/donut-common/client');

// token retrieving logic
var getTokenFromSession = function (callback) {
  AsyncStorage.getItem('token', callback);
};

module.exports = Client({
  device: 'native',
  host: 'https://test.donut.me',
  debug: function () {
    console.log(JSON.stringify(arguments));
  },
  retrieveToken: getTokenFromSession,
  invalidToken: getTokenFromSession
});

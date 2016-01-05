'use strict';

var React = require('react-native');
var debug = require('./libs/debug')('system');

import CodePush from 'react-native-code-push';

module.exports = React.createClass({
  getInitialState () {
    // init configuration from initialProps from native
    require('./libs/config')(this.props);

    return {
      currentUserReady: false,
      isLoggedIn: false
    };
  },
  componentDidMount () {
    // check for new version
    // @doc: https://github.com/Microsoft/react-native-code-push#codepushsync
    CodePush.sync({ updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE });
    // @todo : do it every n times

    // listen for currentUser status change
    var currentUser = require('./models/current-user');
    currentUser.on('authenticationChanged', () => {
      this.setState({
        currentUserReady: true,
        isLoggedIn: currentUser.isLoggedIn()
      });
    }, this);

    // launch
    currentUser.loadInitialState();
  },
  componentWillUnmount () {
    var currentUser = require('./models/current-user');
    currentUser.off(null, null, this);
  },
  render () {
    if (!this.state.currentUserReady) {
      var Launching = require('./views/Launching');
      return (
        <Launching ref='current' text="loading ..." />
      );
    }
    if (!this.state.isLoggedIn) {
      var LoggedOut = require('./loggedOut/index'); // @important, lazy load
      return (
        <LoggedOut ref='current' />
      );
    } else {
      var LoggedIn = require('./navigation/LoggedIn'); // @important, lazy load
      return (
        <LoggedIn ref='current' />
      );
    }
  }
});

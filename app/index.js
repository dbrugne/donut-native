'use strict';

var React = require('react-native');
var debug = require('./libs/debug')('system');

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
        <Launching ref='current' text="chargement ..." />
      );
    }
    if (!this.state.isLoggedIn) {
      var LoggedOut = require('./navigation/LoggedOut'); // @important, lazy load
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

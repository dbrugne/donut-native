'use strict';

var React = require('react-native');

var {
  Component,
} = React;

var currentUser = require('./models/mobile-current-user');
var Launching = require('./views/Launching');
var LoggedOut = require('./navigation/LoggedOut');
var LoggedIn = require('./navigation/LoggedIn');
var debug = require('./libs/debug')('system');

global.currentUser = currentUser;

class Index extends Component {
  constructor (props) {
    super(props);
    debug('RN ENV FROM XCODE IS', this.props);
    this.state = {
      currentUserReady: false,
      isLoggedIn: false
    };
  }

  componentDidMount () {
    // listen for currentUser status change
    currentUser.on('authenticationChanged', () => {
      this.setState({
        currentUserReady: true,
        isLoggedIn: currentUser.isLoggedIn()
      });
    }, this);

    // launch
    currentUser.loadInitialState();
  }

  componentWillUnmount () {
    currentUser.off(null, null, this);
  }

  render () {
    if (!this.state.currentUserReady) {
      // wait for ready to launch state
      return (<Launching ref='current' text="chargement ..." />);
    }
    if (!this.state.isLoggedIn) {
      return (
        <LoggedOut ref='current' />
      );
    } else {
      return (
        <LoggedIn ref='current' />
      );
    }
  }
}

module.exports = Index;
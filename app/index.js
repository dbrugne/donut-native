'use strict';

var React = require('react-native');

var {
  Component,
} = React;

var currentUser = require('./models/mobile-current-user');
var Launch = require('./views/Launching');
var LoggedOut = require('./navigation/LoggedOut');
var LoggedIn = require('./navigation/LoggedIn');

global.currentUser = currentUser;

//@todo handle android return button BackAndroid.addEventListener('hardwareBackPress'...

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentUserReady: false,
      isLoggedIn: false
    };
  }

  componentDidMount () {
    // listen for currentUser status change
    currentUser.on('currentUserStatus', () => this.setState({
      currentUserReady: true,
      isLoggedIn: currentUser.isLoggedIn()
    }));

    // launch
    currentUser.loadInitialState();
  }

  componentWillUnmount () {
    currentUser.off('currentUserStatus');
  }

  render () {
    if (!this.state.currentUserReady) {
      // wait for ready to launch state
      return (<Launch ref='current'/>);
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
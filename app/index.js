'use strict';

var React = require('react-native');

import CodePush from 'react-native-code-push';

import ActionSheet from '@exponent/react-native-action-sheet';

var Index = React.createClass({
  childContextTypes: {
    actionSheet: React.PropTypes.func
  },
  getChildContext () {
    return {
      actionSheet: () => this._actionSheetRef
    };
  },
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
    CodePush.sync({
      updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix: "What's new: "
      },
      installMode: CodePush.InstallMode.IMMEDIATE
    });

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
        <Launching ref='current' text='loading ...' />
      );
    }
    if (!this.state.isLoggedIn) {
      var LoggedOut = require('./loggedOut/index'); // @important, lazy load
      return (
        <LoggedOut ref='current' />
      );
    } else {
      var LoggedIn = require('./loggedIn/index'); // @important, lazy load
      return (
        <ActionSheet ref={component => this._actionSheetRef = component}>
          <LoggedIn ref='current' />
        </ActionSheet>
      );
    }
  }
});

module.exports = Index;

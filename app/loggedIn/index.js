'use strict';

var React = require('react-native');
var {
  View
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var navigation = require('../navigation/index');
var ChooseUsername = require('../views/ChooseUsername');
var Keyboard = require('../components/Keyboard');
var PushNotification = require('../pushNotification/index');

var LoggedIn = React.createClass({
  nextFocus: null,
  getInitialState () {
    return {
      usernameRequired: false
    };
  },
  componentDidMount () {
    app.on('usernameRequired', this.onUsernameRequired, this);
    app.on('ready', this.onReady, this);

    app.on('discussionAdded', this.onDiscussionAdded);
    app.on('discussionRemoved', this.onDiscussionRemoved);

    app.on('joinRoom', this.onJoinRoom, this);
    app.on('joinUser', this.onJoinUser, this);

    // client (disconnect automatically by react-native after 50s in background)
    app.client.connect();
  },
  componentWillUnmount () {
    // cleanup donut-client state
    app.off(null, null, this);
    app.reset();

    // client
    app.client.disconnect();
  },
  render () {
    if (this.state.usernameRequired === true) {
      return (
        <ChooseUsername />
      );
    }

    var RootNavigator = require('../navigation/components/RootNavigator');
    return (
      <View style={{flex: 1}}>
        <PushNotification ref='pushNotification' />
        <Keyboard />
        <RootNavigator />
      </View>
    );
  },
  onUsernameRequired () {
    this.setState({usernameRequired: true});
  },
  onReady () {
    // @important: async to let RootNavigator render
    this.setState({ usernameRequired: false }, () => {
      // handle cold launch from notification
      this.refs.pushNotification.handleInitialNotification();
    });
  },
  onDiscussionAdded: function (model) {
    if (this.nextFocus === model.get('id')) {
      navigation.navigate('Discussion', model);
    }
  },
  onDiscussionRemoved: function (model) {
    navigation.removeDiscussionRoute(model);
  },
  onJoinRoom (id) {
    // @todo : factorize in navigation.navigate()
    if (!id) {
      return;
    }

    // already joined
    var model = app.rooms.get(id);
    if (model) {
      return navigation.navigate('Discussion', model);
    }

    this.nextFocus = id;
    app.client.roomJoin(id, null, (response) => {
      if (response.err) {
        // @todo handle errors
        return;
      }
    });
  },
  onJoinUser (id) {
    // @todo : factorize in navigation.navigate()
    if (!id) {
      return;
    }

    // already joined
    var model = app.ones.get(id);
    if (model) {
      return navigation.navigate('Discussion', model);
    }

    this.nextFocus = id;
    app.client.userJoin(id, function (response) {
      if (response.err) {
        // @todo handle errors
        return;
      }
    });
  }
});

module.exports = LoggedIn;

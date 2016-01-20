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
var PushNotifications = require('../pushNotification/index');

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

    app.on('newEvent', this.onNewEvent, this);
    app.on('viewedEvent', this.computeUnviewed, this);
    app.on('joinRoom', this.onJoinRoom, this);
    app.on('joinUser', this.onJoinUser, this);

    // push notifications
    PushNotifications.componentDidMount();

    // client (disconnect automatically by react-native after 50s in background)
    app.client.connect();
  },
  componentWillUnmount () {
    // cleanup donut-client state
    app.off(null, null, this);
    app.reset();

    // push notifications
    PushNotifications.componentWillUnmount();

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
      this.computeUnviewed();

      // handle cold launch from notification
      PushNotifications.handleInitialNotification();
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
    console.log(id);
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
  },
  onNewEvent (type, data, model) {
    if (!data) {
      return;
    }

    // last event time
    model.set('last', Date.now());

    var collection = (model.get('type') === 'room')
      ? app.rooms
      : app.ones;

    var uid = data.from_user_id || data.user_id;

    // badge (even if focused), only if user sending the message is not currentUser
    if (model.get('unviewed') !== true && currentUser.get('user_id') !== uid) {
      model.set('unviewed', true);
      model.set('first_unviewed', data.id);
      currentUser.set('unviewed', true);
    }

    // update navigation
    collection.sort();
    if (model.get('type') === 'room') {
      app.trigger('redrawNavigationRooms');
    } else {
      app.trigger('redrawNavigationOnes');
    }
  },
  computeUnviewed () {
    // @todo : factorize in donut-client
    var list = app.ones.models.concat(app.rooms.models);
    var found = _.find(list, (m) => (m.get('unviewed') === true));
    currentUser.set('unviewed', !!found);
  }
});

module.exports = LoggedIn;

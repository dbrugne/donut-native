'use strict';

var React = require('react-native');
var {
  Component
} = React;
var Launching = require('../views/Launching');
var ChooseUsername = require('../views/ChooseUsername');

var _ = require('underscore');
var debug = require('../libs/debug')('navigation');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var navigation = require('../navigation/index');

var PushNotifications = require('../pushNotification/index');

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
      usernameRequired: false
    };
    this.nextFocus;
  }
  componentDidMount () {
    app.on('usernameRequired', () => this.setState({usernameRequired: true}), this);
    app.on('ready', this.onReady, this);
    app.on('newEvent', this.onNewEvent, this);
    app.on('viewedEvent', this.computeUnviewed, this);
    app.on('joinRoom', this.onJoinRoom, this);
    app.on('joinUser', this.onJoinUser, this);
    app.ones.on('remove', this.onRemoveDiscussion, this);
    app.rooms.on('remove', this.onRemoveDiscussion, this);
    app.ones.on('add', this.onAddDiscussion, this);
    app.rooms.on('add', this.onAddDiscussion, this);

    // push notifications
    PushNotifications.componentDidMount();

    // client
    app.client.connect(); // closed automatically (react-native) after 50s when app is backgrounded
  }
  componentWillUnmount () {
    app.off(null, null, this);
    app.ones.off(null, null, this);
    app.rooms.off(null, null, this);
    app.reset(); // @important

    // push notifications
    PushNotifications.componentWillUnmount();

    // client
    app.client.disconnect();
  }
  render () {
    if (this.state.usernameRequired === true) {
      return (
        <ChooseUsername />
      );
    }

    var RootNavigator = require('../navigation/components/RootNavigator');
    return (
      <RootNavigator />
    );
  }
  onReady (data) {
    // normal welcome (async to let RootNavigator render)
    this.setState({
      usernameRequired: false // @important
    }, () => {
      this.computeUnviewed();

      // handle cold launch from notification
      PushNotifications.handleInitialNotification();
    });
  }
  computeUnviewed () {
    var list = app.ones.models.concat(app.rooms.models);
    var found = _.find(list, (m) => (m.get('unviewed') === true));
    currentUser.set('unviewed', !!found);
  }
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
  }
  onAddDiscussion (model) {
    if (this.nextFocus === model.get('id')) {
      navigation.navigate('Discussion', model);
    }
  }
  onRemoveDiscussion (model) {
    navigation.removeDiscussionRoute(model);
  }
  onJoinRoom (id, forceRejoin) {
    if (!id) {
      return;
    }

    var model = app.rooms.find((m) => m.get('room_id') === id);
    if (model && !forceRejoin) {
      return navigation.navigate('Discussion', model);
    }

    this.nextFocus = id;
    app.client.roomJoin(id, null, (response) => {
      if (response.code === 403) {
        app.rooms.addModel(response.room, response.err);
      }
      // @todo handle errors
      // response.err === 'group-members-only'
      // response.code === 404
      // response.code === 403 => blocked model handling
      // response.code === 500
    });
  }
  onJoinUser (id) {
    if (!id) {
      return;
    }

    console.log(id);
    var model = app.ones.find((m) => m.get('user_id') === id);
    if (model) {
      return navigation.navigate('Discussion', model);
    }

    this.nextFocus = id;
    app.client.userJoin(id, function (response) {
      // @todo handle errors
      // response.code !== 500 usernotexist
      // response.code === 500
    });
  }
}

module.exports = Index;

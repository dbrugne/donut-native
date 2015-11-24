'use strict';

var React = require('react-native');

var {
  Component
} = React;

var _ = require('underscore');
var onetoones = require('../collections/onetoones');
var rooms = require('../collections/rooms');
var app = require('../libs/app');
var client = require('../libs/client');
var currentUser = require('../models/current-user');
var navigation = require('../libs/navigation');

// @todo : if application is backgrounded for > 5 mn disconnect
// @todo : when disconnected block every views/navigation

class Index extends Component {
  constructor (props) {
    super(props);
    this.client = client;
  }
  componentDidMount () {
    app.on('newEvent', this.onNewEvent, this);
    app.on('viewedEvent', this.computeUnviewed, this);
    onetoones.on('remove', this.onRemoveDiscussion, this);
    rooms.on('remove', this.onRemoveDiscussion, this);
    client.on('welcome', this.onWelcome, this);

    this.client.connect();
  }
  componentWillUnmount () {
    app.off(null, null, this);
    onetoones.off(null, null, this);
    rooms.off(null, null, this);
    client.off(null, null, this);

    this.client.disconnect();
  }
  render () {
    var RootNavigator = require('../libs/navigation').RootNavigator;
    return (
      <RootNavigator />
    );
  }
  onWelcome (data) {
    currentUser.onWelcome(data);
    onetoones.onWelcome(data);
    rooms.onWelcome(data);

    this.computeUnviewed();
  }
  computeUnviewed () {
    var list = onetoones.models.concat(rooms.models);
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
      ? require('../collections/rooms')
      : require('../collections/onetoones');

    var uid = data.from_user_id || data.user_id;

    // badge (even if focused), only if user sending the message is not currentUser
    if (model.get('unviewed') !== true && currentUser.get('user_id') !== uid) {
      model.set('unviewed', true);
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
  onRemoveDiscussion (model) {
    navigation.removeDiscussionRoute(model.get('id'), model);
  }
}

module.exports = Index;

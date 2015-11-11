'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity,
  View,
  Component
} = React;
var {
  Icon
} = require('react-native-icons');

var app = require('../libs/app');
var current = require('../models/current-user');
var rooms = require('../collections/rooms');
var onetoones = require('../collections/onetoones');

class LeftButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      unviewed: false
    };
  }
  componentDidMount () {
    app.on('redrawNavigationOnes', this.onUnviewed.bind(this));
    app.on('redrawNavigationRooms', this.onUnviewed.bind(this));
    app.on('newEvent', this.onNewEvent.bind(this));
  }
  componentWillUnmount () {
    app.off('redrawNavigationOnes');
    app.off('redrawNavigationRooms');
    app.off('newEvent');
  }
  render () {
    var badge = null;
    if (this.state.unviewed === true) {
      badge = (
        <Icon
          name='fontawesome|circle'
          size={11}
          color='#FF0000'
          style={styles.iconUnviewed}
          />
      );
    }
    return (
      <TouchableOpacity style={[styles.leftContainer]} onPress={() => app.trigger('toggleDrawer')}>
        <Icon
          name='fontawesome|bars'
          size={25}
          color='#5f5e63'
          style={styles.icon}
          />
        {badge}
      </TouchableOpacity>
    );
  }
  onUnviewed (data) {
    var hasUnviewed = false;
    rooms.some(function (m) {
      return (m.get('unviewed') === true);
    });
    onetoones.some(function (m) {
      return (m.get('unviewed') === true);
    });

    this.setState({
      unviewed: hasUnviewed
    })
  }
  onNewEvent (type, data, model) {
    if (!data) {
      return;
    }

    // last event time
    model.set('last', Date.now());

    var collection = (model.get('type') === 'room')
      ? rooms
      : onetoones;

    var uid = data.from_user_id || data.user_id;

    // badge (even if focused), only if user sending the message is not currentUser
    if (model.get('unviewed') !== true && currentUser.get('user_id') !== uid) {
      model.set('unviewed', true);
    }

    // update navigation
    collection.sort();
    if (model.get('type') === 'room') {
      app.trigger('redrawNavigationRooms');
    } else {
      app.trigger('redrawNavigationOnes');
    }

    // @todo : not working due to app focus/unfocus, remain currently focused discussion logic
//    // ignore event from currentUser
//    if (currentUser.get('user_id') === uid) {
//      return;
//    }
//
//    // if current discussion is focused do nothing more
//    if (model.get('focused')) {
//      return;
//    }
//
//    this.setState({unviewed: true});
  }
}

var styles = StyleSheet.create({
  leftContainer: {
    marginLeft: 10,
    paddingRight: 5,
    marginVertical: 9
  },
  icon: {
    width: 24,
    height: 24
  },
  iconUnviewed: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: -4,
    left: 16
  }
});

module.exports = LeftButton;

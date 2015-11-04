'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  TouchableHighlight
} = React;

var app = require('../libs/app');
var rooms = require('../collections/rooms');

var RoomView = require('../views/RoomView'); // @todo : implement routing logic

class NavigationRoomsView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      elements: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  }

  componentWillMount () {
    app.on('redrawNavigation', () => this.refreshData());
    app.on('redrawNavigationRooms', () => this.refreshData());
  }

  refreshData () {
    this.setState({
      elements: this.state.elements.cloneWithRows(rooms.toJSON())
    });
  }

  render () {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>rooms</Text>
        <ListView
          dataSource={this.state.elements}
          renderRow={this.renderElement.bind(this)}
          style={styles.listView}
          scrollEnabled={false}
        />
      </View>
    );
  }

  renderElement (e) {
    if (e.blocked) {
      return (
        <View style={[styles.item]}>
          <Text style={[styles.itemTitle, {color: '#AAAAAA'}]}>{e.identifier} (blocked)</Text>
        </View>
      );
    }

    return (
      <TouchableHighlight onPress={() => this.navigateToRoom(e.room_id, e.identifier)}>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{e.identifier}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  navigateToRoom (id, title) {
    app.trigger('navigateTo', {
      name: 'one-' + id,
      title: title,
      component: RoomView,
      id: id,
    });
  }

};

var styles = StyleSheet.create({
  block: {
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 8,
    color: '#FFFFFF'
  },
  listView: {
  },
  item: {
    paddingLeft: 10,
    paddingVertical: 3,
  },
  itemTitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#FFFFFF'
  }
});

module.exports = NavigationRoomsView;

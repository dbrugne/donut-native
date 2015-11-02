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

var RoomView = require('../views/Room'); // @todo : implement routing logic

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
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    color: '#00FF00'
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
  item: {
    backgroundColor: '#F5FCFF',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 18,
  },
});

module.exports = NavigationRoomsView;

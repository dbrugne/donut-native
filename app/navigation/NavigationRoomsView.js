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

  componentDidMount () {
    app.on('redrawNavigation', () => this.refreshData());
    app.on('redrawNavigationRooms', () => this.refreshData());
  }
  componentWillUnmount () {
    app.off('redrawNavigation');
    app.off('redrawNavigationRooms');
  }

  refreshData () {
    this.setState({
      elements: this.state.elements.cloneWithRows(rooms.toJSON())
    });
  }

  render () {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>ROOMS</Text>
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

    var model = rooms.get(e.room_id);
    if (!model) {
      return;
    }

    var badge = null;
    if (model.get('unviewed')) {
      badge = (
        <Text style={styles.unviewed}>●</Text>
      );
    }

    return (
      <TouchableHighlight
        onPress={() => app.trigger('navigateTo', 'room/' + model.get('id'))}
        underlayColor='#888888'
        >
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{e.identifier}</Text>
          {badge}
        </View>
      </TouchableHighlight>
    );
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
  },
  unviewed: {
    position: 'absolute',
    top: 0,
    right: 10,
    fontSize: 20,
    color: '#fc2063'
  }
});

module.exports = NavigationRoomsView;

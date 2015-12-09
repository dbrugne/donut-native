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
var navigation = require('../libs/navigation');

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
    app.on('redrawNavigation', this.refreshData, this);
    app.on('redrawNavigationRooms', this.refreshData, this);
    app.on('viewedEvent', this.refreshData, this);
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }

  refreshData () {
    this.setState({
      elements: this.state.elements.cloneWithRows(rooms.toJSON())
    });
  }

  render () {
    return (
      <View>
        <View style={{backgroundColor: '#1D1D1D'}}>
          <Text style={styles.title}>ROOMS</Text>
        </View>
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
          <Text style={[styles.itemTitle, {textDecorationLine: 'line-through'}]}>{e.identifier}</Text>
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
        style={styles.linkBlock}
        onPress={() => navigation.switchTo(navigation.getDiscussion(model.get('id'), model))}
        underlayColor= '#414041'
        >
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{model.get('identifier')}</Text>
          {badge}
        </View>
      </TouchableHighlight>
    );
  }
};

var styles = StyleSheet.create({
  title: {
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 'bold',
    margin: 10,
    color: '#FFFFFF'
  },
  listView: {
  },
  item: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 4
  },
  itemTitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#ecf0f1',
    marginLeft: 10,
    flex:1
  },
  unviewed: {
    fontSize: 20,
    color: '#fc2063',
    marginRight:10
  },
  linkBlock: {
    paddingTop: 2,
    paddingBottom: 2,
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  }
});

module.exports = NavigationRoomsView;

'use strict';

var React = require('react-native');
var _ = require('underscore');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  TouchableHighlight
} = React;

var app = require('../../libs/app');
var navigation = require('../index');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'drawer_content_rooms', {
  'rooms': 'DISCUSSIONS'
});

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
    this.lastGroup = null;
  }

  componentDidMount () {
    app.on('redrawNavigation', this.refreshData, this);
    app.on('redrawNavigationRooms', this.refreshData, this);
    app.on('viewedEvent', this.refreshData, this);
    app.on('focusModelChanged', this.refreshData, this);
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }

  refreshData () {
    var rooms = [];
    _.each(app.rooms.toJSON(), (room) => {
      // only add room with no group
      if (!room.group_id) {
        rooms.push(room);
      }
    });
    this.setState({
      elements: this.state.elements.cloneWithRows(rooms)
    });
  }

  render () {
    this.lastGroup = null;
    var title = null;
    if (app.rooms.length > 0) {
      title = (
        <View style={{backgroundColor: '#1D1D1D'}}>
          <Text style={styles.title}>{i18next.t('drawer_content_rooms:rooms')}</Text>
        </View>
      );
    }
    return (
      <View>
        {title}
        <ListView
          dataSource={this.state.elements}
          renderRow={(e) => this.renderElement(e)}
          style={styles.listView}
          scrollEnabled={false}
        />
      </View>
    );
  }

  renderElement (e) {
    var model = app.rooms.get(e.room_id);
    if (!model) {
      return null;
    }

    if (e.blocked) {
      return (
        <View>
          <TouchableHighlight
            style={[styles.linkBlock, {backgroundColor: (model.get('focused')) ? '#666' : '#222'}]}
            onPress={() => navigation.navigate('Discussion', model)}
            underlayColor= '#414041'
            >
            <View style={styles.item}>
              <Text style={[styles.itemTitle, {textDecorationLine: 'line-through'}]}>
                {('#' + model.get('name'))}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    var badge = null;
    if (model.get('unviewed')) {
      badge = (
        <Text style={styles.unviewed}>●</Text>
      );
    }

    return (
      <View>
      <TouchableHighlight
        style={[styles.linkBlock, {backgroundColor: (model.get('focused')) ? '#666' : '#222'}]}
        onPress={() => navigation.navigate('Discussion', model)}
        underlayColor= '#414041'
        >
        <View style={styles.item}>
          <Text style={styles.itemTitle}>
            {('#' + model.get('name'))}
          </Text>
          {badge}
        </View>
      </TouchableHighlight>
      </View>
    );
  }
}

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
    marginVertical: 2,
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
    flex: 1,
    marginVertical: 10
  },
  unviewed: {
    fontSize: 20,
    color: '#fc2063',
    marginRight: 10
  },
  linkBlock: {
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  }
});

module.exports = NavigationRoomsView;
